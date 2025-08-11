import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type TaskCategory } from "@shared/schema";

interface CategorySelectionProps {
  selectedCategory: TaskCategory | "";
  onCategorySelect: (category: TaskCategory) => void;
}

export function CategorySelection({ selectedCategory, onCategorySelect }: CategorySelectionProps) {
  const categories = [
    {
      id: "spicy" as TaskCategory,
      emoji: "🌶️",
      name: "Spicy",
      description: "Rohkeita haasteita",
    },
    {
      id: "funny" as TaskCategory,
      emoji: "😂",
      name: "Funny",
      description: "Hauskoja tehtäviä",
    },
    {
      id: "party" as TaskCategory,
      emoji: "🎊",
      name: "Party",
      description: "Bilemeininki",
    },
  ];

  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-white">🎯 Valitse kategoria</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedCategory} onValueChange={onCategorySelect}>
          <SelectTrigger className="w-full bg-gray-600 border-gray-500 text-white text-lg py-3" data-testid="select-category">
            <SelectValue placeholder="Valitse kategoria..." />
          </SelectTrigger>
          <SelectContent className="bg-gray-600 border-gray-500">
            {categories.map((category) => (
              <SelectItem 
                key={category.id} 
                value={category.id}
                className="text-white hover:bg-gray-500 focus:bg-gray-500"
                data-testid={`option-category-${category.id}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.emoji}</span>
                  <div>
                    <span className="font-semibold">{category.name}</span>
                    <span className="text-sm text-gray-300 ml-2">- {category.description}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
