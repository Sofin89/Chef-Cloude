import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Mic, MicOff, Plus, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
           
const SUGGESTED_INGREDIENTS = [
  'chicken', 'beef', 'salmon', 'rice', 'pasta', 'tomatoes', 'onions', 'garlic', 'bell peppers',
  'mushrooms', 'cheese', 'eggs', 'milk', 'flour', 'olive oil', 'basil', 'oregano', 'salt',
  'pepper', 'lemon', 'butter', 'spinach', 'carrots', 'potatoes', 'broccoli', 'avocado',
  'cilantro', 'ginger', 'soy sauce', 'honey', 'vanilla', 'chocolate', 'strawberries', 'bananas'
];

interface IngredientInputProps {
  ingredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
  onRandomize: () => void;
}

export default function IngredientInput({ ingredients, onIngredientsChange, onRandomize }: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = SUGGESTED_INGREDIENTS.filter(ingredient =>
        ingredient.toLowerCase().includes(inputValue.toLowerCase()) &&
        !ingredients.includes(ingredient)
      ).slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, ingredients]);

  const addIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      onIngredientsChange([...ingredients, trimmed]);
      setInputValue('');
      setShowSuggestions(false);
      toast.success(`Added ${trimmed} to your recipe! 🥘`);
    } else if (ingredients.includes(trimmed)) {
      toast.error(`${trimmed} is already in your ingredient list! 🔄`);
    }
  };

  const removeIngredient = (ingredient: string) => {
    onIngredientsChange(ingredients.filter(item => item !== ingredient));
    toast.success(`Removed ${ingredient} 🗑️`);
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input is not supported in your browser 😕');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      toast.success('Listening... speak your ingredient! 🎤');
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      addIngredient(transcript);
    };

    recognitionRef.current.onerror = () => {
      toast.error('Voice recognition error. Please try again! 🔄');
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const addRandomIngredients = () => {
    const randomCount = Math.floor(Math.random() * 3) + 2; // 2-4 ingredients
    const availableIngredients = SUGGESTED_INGREDIENTS.filter(ingredient => 
      !ingredients.includes(ingredient)
    );
    
    const randomIngredients = [];
    for (let i = 0; i < randomCount && availableIngredients.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableIngredients.length);
      const ingredient = availableIngredients.splice(randomIndex, 1)[0];
      randomIngredients.push(ingredient);
    }
    
    onIngredientsChange([...ingredients, ...randomIngredients]);
    toast.success(`Added ${randomIngredients.length} surprise ingredients! ✨`);
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold chef-title mb-2">
          What's in your kitchen? 🧑‍🍳
        </h2>
        <p className="text-muted-foreground">
          Add ingredients manually, use your voice, or get surprised!
        </p>
      </div>

      {/* Input Section */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addIngredient(inputValue)}
              placeholder="Type an ingredient..."
              className="pr-12 text-lg h-12 border-2 border-primary/20 focus:border-primary transition-colors"
            />
            <Button
              onClick={() => addIngredient(inputValue)}
              disabled={!inputValue.trim()}
              size="icon"
              variant="chef"
              className="absolute right-1 top-1 h-10 w-10"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            onClick={isListening ? stopVoiceInput : startVoiceInput}
            variant={isListening ? "destructive" : "secondary"}
            size="lg"
            className={`px-4 ${isListening ? 'animate-pulse' : ''}`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
          
          <Button
            onClick={addRandomIngredients}
            variant="magical"
            size="lg"
            className="px-4"
          >
            <Sparkles className="w-5 h-5" />
          </Button>
        </div>

        {/* Suggestions */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-2 p-4 bg-card border border-border rounded-lg shadow-lg"
            >
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    onClick={() => addIngredient(suggestion)}
                    variant="outline"
                    size="sm"
                    className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ingredients List */}
      <AnimatePresence>
        {ingredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="recipe-card p-6 rounded-2xl"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Your Ingredients ({ingredients.length})
              <span className="text-2xl">🥬</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <motion.div
                  key={ingredient}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className="ingredient-bounce"
                >
                  <Badge 
                    variant="secondary" 
                    className="text-sm py-2 px-3 bg-gradient-to-r from-secondary to-accent text-secondary-foreground cursor-pointer hover:scale-105 transition-transform"
                  >
                    {ingredient}
                    <Button
                      onClick={() => removeIngredient(ingredient)}
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-2 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
