import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChefAvatar3D from '@/components/ChefAvatar3D';
import IngredientInput from '@/components/IngredientInput';
import RecipeGenerator from '@/components/RecipeGenerator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Coffee, Star } from 'lucide-react';
import { toast } from 'sonner';

const RANDOM_INGREDIENTS = [
  ['chicken', 'rice', 'soy sauce'],
  ['salmon', 'lemon', 'dill'],
  ['pasta', 'tomatoes', 'basil'],
  ['beef', 'potatoes', 'onions'],
  ['eggs', 'cheese', 'spinach'],
  ['shrimp', 'garlic', 'butter'],
  ['mushrooms', 'cream', 'herbs'],
  ['avocado', 'lime', 'cilantro']
];

export default function Index() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: "Good Morning", emoji: "🌅", icon: Coffee };
    if (hour < 17) return { text: "Good Afternoon", emoji: "☀️", icon: Star };
    return { text: "Good Evening", emoji: "🌙", icon: Sparkles };
  };

  const handleRandomInspiration = async () => {
    const randomSet = RANDOM_INGREDIENTS[Math.floor(Math.random() * RANDOM_INGREDIENTS.length)];
    setIngredients(randomSet);
    toast.success(`Inspired by TheMealDB! Try these ingredients: ${randomSet.join(', ')} ✨`);
  };

  const greeting = getGreeting();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        className="relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="relative container mx-auto px-4 py-12">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <ChefAvatar3D isGenerating={isGenerating} className="float-animation" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground mb-2">
                <greeting.icon className="w-5 h-5" />
                <span>{greeting.text}! {greeting.emoji}</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold chef-title mb-4">
                Chef Cloudé
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Your playful AI cooking companion! 🧑‍🍳<br />
                <span className="text-lg">Turn your random ingredients into culinary masterpieces with a sprinkle of magic ✨</span>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12 space-y-12">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="recipe-card p-6 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold chef-title">Smart AI</div>
            <p className="text-muted-foreground">Creative & simple recipe modes</p>
          </Card>
          
          <Card className="recipe-card p-6 text-center">
            <div className="text-3xl mb-2">🎤</div>
            <div className="text-2xl font-bold chef-title">Voice Input</div>
            <p className="text-muted-foreground">Hands-free cooking assistance</p>
          </Card>
          
          <Card className="recipe-card p-6 text-center">
            <div className="text-3xl mb-2">🎨</div>
            <div className="text-2xl font-bold chef-title">3D Magic</div>
            <p className="text-muted-foreground">Interactive 3D chef companion</p>
          </Card>
        </motion.div>

        {/* Ingredient Input */}
        <IngredientInput
          ingredients={ingredients}
          onIngredientsChange={setIngredients}
          onRandomize={handleRandomInspiration}
        />

        {/* Recipe Generator */}
        <RecipeGenerator
          ingredients={ingredients}
          onRandomInspiration={handleRandomInspiration}
        />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center py-8"
        >
          <div className="text-muted-foreground mb-4">
            Made Chef Cloudé • Your AI Cooking Companion
          </div>
          <div className="text-sm text-muted-foreground">
            🌟 Pro Tip: The secret ingredient is always love (and maybe a little bit of magic) ✨
          </div>
        </motion.div>
      </main>

      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
            }}
            animate={{
              y: -100,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ left: Math.random() * 100 + "%" }}
          >
            {['🥕', '🍅', '🥬', '🧄', '🌶️', '🫐'][i]}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
