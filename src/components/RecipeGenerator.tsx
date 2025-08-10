import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Wand2, ChefHat, Clock, Users, Download, Copy, Heart, Shuffle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  servings: string;
  difficulty: string;
  tips: string[];
  cuisine?: string;
  mealType?: string;
}

interface RecipeGeneratorProps {
  ingredients: string[];
  onRandomInspiration: () => void;
}

const CUISINES = [
  'Any', 'Italian', 'Mexican', 'Asian', 'Mediterranean', 'Indian', 'French', 
  'American', 'Thai', 'Japanese', 'Greek', 'Spanish', 'Chinese', 'Korean'
];

const MEAL_TYPES = [
  'Any', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Appetizer', 'Soup', 'Salad'
];

export default function RecipeGenerator({ ingredients, onRandomInspiration }: RecipeGeneratorProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<'creative' | 'simple'>('creative');
  const [cuisine, setCuisine] = useState('Any');
  const [mealType, setMealType] = useState('Any');
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('chef-claude-recipes');
    return saved ? JSON.parse(saved) : [];
  });

  const generateCreativeRecipe = (ingredients: string[], cuisine: string, mealType: string): Recipe => {
    const titles = [
      `🌟 Magical ${ingredients[0]} Surprise`,
      `✨ Chef Cloudé's Secret ${ingredients[0]} Delight`,
      `🎭 The Great ${ingredients[0]} Adventure`,
      `🔥 Sizzling ${ingredients[0]} Masterpiece`,
      `🌈 Rainbow ${ingredients[0]} Festival`
    ];

    const descriptions = [
      `🎉 Hold onto your chef hats! This isn't just a recipe - it's a culinary journey that'll make your taste buds dance the tango! 💃`,
      `🎪 Welcome to the greatest show on Earth... er, your kitchen! This recipe is like a circus act, but everything edible! 🤹‍♂️`,
      `🚀 Buckle up, space chef! We're about to launch your ${ingredients[0]} into flavor orbit! 🛸`,
      `🎨 Picture this: your kitchen becomes an art studio, and you're about to paint the most delicious masterpiece ever! 🖼️`,
      `🏰 Once upon a time, in a kitchen far, far away... actually, it's your kitchen, and this recipe is your fairy tale! ✨`
    ];

    const instructions = [
      `🔥 **STEP 1:** Prep your ${ingredients[0]} - chop, wash, or dice as needed. ✨`,
      
      `🎭 **STEP 2:** Heat pan with oil over medium heat until it sizzles. 🔥`,
      
      `🌪️ **STEP 3:** Add ${ingredients.slice(1).join(', ')} and cook 3-5 minutes. 🌟`,
      
      `🎪 **STEP 4:** Season with salt, pepper, and spices. Taste and adjust! 🎤`,
      
      `🏆 **STEP 5:** Cook until golden and tender. Serve hot! 🎆`
    ];

    const tips = [
      `💡 **Chef Cloudé's Secret:** Always taste as you cook - your taste buds are your best sous chef! 👨‍🍳`,
      `🎯 **Pro Tip:** If something seems too salty, add a pinch of sugar. If it's too sweet, add a tiny bit of salt. It's like kitchen magic! ✨`,
      `🌟 **Confidence Booster:** Remember, even professional chefs have "oops" moments. Embrace the adventure! 🚀`,
      `🎨 **Presentation Power:** Make it pretty! A sprinkle of fresh herbs or a drizzle of olive oil can make any dish Instagram-worthy! 📸`,
      `❤️ **Love Ingredient:** The most important ingredient is the love you put into it. Corny? Yes. True? Absolutely! 💕`
    ];

    return {
      title: titles[Math.floor(Math.random() * titles.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      ingredients: [`🥘 ${ingredients.length} amazing ingredients: ${ingredients.join(', ')}`],
      instructions,
      cookingTime: `⏰ ${15 + Math.floor(Math.random() * 45)} minutes of pure kitchen joy`,
      servings: `👥 Serves ${2 + Math.floor(Math.random() * 4)} hungry humans`,
      difficulty: `🎯 ${['Beginner-friendly', 'Easy peasy', 'Moderate fun', 'Chef challenge'][Math.floor(Math.random() * 4)]}`,
      tips,
      cuisine,
      mealType
    };
  };

  const generateSimpleRecipe = (ingredients: string[], cuisine: string, mealType: string): Recipe => {
    const title = `${cuisine !== 'Any' ? cuisine + ' ' : ''}${mealType !== 'Any' ? mealType + ' ' : ''}with ${ingredients.slice(0, 2).join(' and ')}`;
    
    const instructions = [
      `Prep ${ingredients[0]} - wash, peel, or chop as needed.`,
      `Heat pan with oil over medium heat.`,
      `Add ${ingredients[0]}, cook 3-4 minutes until browned.`,
      `Add ${ingredients.slice(1).join(', ')} and season.`,
      `Cook 10-15 minutes, stirring occasionally.`,
      `Serve hot and enjoy!`
    ];

    const tips = [
      'Don\'t overcrowd the pan - cook in batches if necessary.',
      'Taste and season throughout the cooking process.',
      'Fresh herbs added at the end can brighten the dish.',
      'Let the dish rest for a few minutes before serving.'
    ];

    return {
      title,
      description: `A delicious and straightforward recipe using ${ingredients.join(', ')}.`,
      ingredients: ingredients.map(ing => `• ${ing}`),
      instructions: instructions.map((inst, i) => `${i + 1}. ${inst}`),
      cookingTime: `${20 + Math.floor(Math.random() * 30)} minutes`,
      servings: `${2 + Math.floor(Math.random() * 4)} servings`,
      difficulty: 'Easy',
      tips,
      cuisine,
      mealType
    };
  };

  const generateRecipe = async () => {
    if (ingredients.length === 0) {
      toast.error('Add some ingredients first! 🥬');
      return;
    }

    setIsGenerating(true);
    toast.success('Chef Cloudé is working his magic! ✨');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newRecipe = mode === 'creative' 
      ? generateCreativeRecipe(ingredients, cuisine, mealType)
      : generateSimpleRecipe(ingredients, cuisine, mealType);

    setRecipe(newRecipe);
    setIsGenerating(false);
    toast.success('Your recipe is ready! 🍽️');
  };

  const saveRecipe = () => {
    if (!recipe) return;
    
    const updated = [...savedRecipes, { ...recipe, id: Date.now() }];
    setSavedRecipes(updated);
    localStorage.setItem('chef-claude-recipes', JSON.stringify(updated));
    toast.success('Recipe saved to your cookbook! 📖');
  };

  const copyRecipe = () => {
    if (!recipe) return;
    
    const recipeText = `# ${recipe.title}\n\n${recipe.description}\n\n## Ingredients\n${recipe.ingredients.join('\n')}\n\n## Instructions\n${recipe.instructions.join('\n')}\n\n## Details\n- ${recipe.cookingTime}\n- ${recipe.servings}\n- ${recipe.difficulty}\n\n## Tips\n${recipe.tips.join('\n')}`;
    
    navigator.clipboard.writeText(recipeText);
    toast.success('Recipe copied to clipboard! 📋');
  };

  const downloadRecipe = () => {
    if (!recipe) return;
    
    const recipeText = `# ${recipe.title}\n\n${recipe.description}\n\n## Ingredients\n${recipe.ingredients.join('\n')}\n\n## Instructions\n${recipe.instructions.join('\n')}\n\n## Details\n- ${recipe.cookingTime}\n- ${recipe.servings}\n- ${recipe.difficulty}\n\n## Tips\n${recipe.tips.join('\n')}`;
    
    const blob = new Blob([recipeText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Recipe downloaded! 📥');
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Controls */}
      <div className="recipe-card p-6 rounded-2xl space-y-4">
        <h2 className="text-2xl font-bold chef-title">Recipe Magic Settings ✨</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Cooking Mode</label>
            <Select value={mode} onValueChange={(value) => setMode(value as 'creative' | 'simple')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="creative">🎭 Creative Chef</SelectItem>
                <SelectItem value="simple">📝 Simple Mode</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Cuisine Type</label>
            <Select value={cuisine} onValueChange={setCuisine}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CUISINES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Meal Type</label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEAL_TYPES.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col justify-end">
            <Button
              onClick={onRandomInspiration}
              variant="outline"
              className="w-full"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Random Inspiration
            </Button>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={generateRecipe}
            disabled={isGenerating || ingredients.length === 0}
            variant="hero"
            size="hero"
            className={`${isGenerating ? 'recipe-generating' : ''}`}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Cooking up magic...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Recipe
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Recipe Display */}
      <AnimatePresence>
        {recipe && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="recipe-card p-8 rounded-2xl space-y-6"
          >
            {/* Recipe Header */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold chef-title">{recipe.title}</h1>
              <p className="text-lg text-muted-foreground">{recipe.description}</p>
              
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary" className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  {recipe.cookingTime}
                </Badge>
                <Badge variant="secondary" className="bg-gradient-to-r from-secondary to-accent text-secondary-foreground">
                  <Users className="w-3 h-3 mr-1" />
                  {recipe.servings}
                </Badge>
                <Badge variant="secondary" className="bg-gradient-to-r from-accent to-secondary text-accent-foreground">
                  <ChefHat className="w-3 h-3 mr-1" />
                  {recipe.difficulty}
                </Badge>
              </div>
            </div>

            {/* Recipe Actions */}
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={saveRecipe} variant="recipe" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save Recipe
              </Button>
              <Button onClick={copyRecipe} variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={downloadRecipe} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            {/* Recipe Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  🧄 Ingredients
                </h3>
                <div className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-muted rounded-lg"
                    >
                      <ReactMarkdown>{ingredient}</ReactMarkdown>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  👨‍🍳 Instructions
                </h3>
                <div className="space-y-3">
                  {recipe.instructions.map((instruction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="p-4 bg-muted rounded-lg"
                    >
                      <ReactMarkdown>{instruction}</ReactMarkdown>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips */}
            {recipe.tips.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  💡 Chef's Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recipe.tips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-lg border border-accent/20"
                    >
                      <ReactMarkdown>{tip}</ReactMarkdown>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}