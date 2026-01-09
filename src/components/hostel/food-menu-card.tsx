
'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Info, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const days = [
  { day: 'Today', date: '06 Jan' },
  { day: 'Tom', date: '07 Jan' },
  { day: 'Thu', date: '08 Jan' },
  { day: 'Fri', date: '09 Jan' },
];

const menuData: { [key: string]: any } = {
  Today: {
    breakfast: [
        { id: 'today-bf-1', name: 'Aloo Paratha with Curd', description: 'Whole wheat flatbread stuffed with spiced potatoes, served with yogurt.', image: 'https://picsum.photos/seed/food1/100/100', default: true, calories: 350 },
        { id: 'today-bf-2', name: 'Poha', description: 'Flattened rice with onions, potatoes, and spices.', image: 'https://picsum.photos/seed/food2/100/100', calories: 250 },
        { id: 'today-bf-3', name: 'Skip Breakfast', description: 'Help us cut down food wastage' },
    ],
    lunch: [
        { id: 'today-lunch-1', name: 'Rajma Chawal', description: 'Red kidney bean curry with steamed rice.', image: 'https://picsum.photos/seed/food3/100/100', default: true, calories: 500 },
        { id: 'today-lunch-2', name: 'Kadai Paneer & Roti', description: 'Indian cottage cheese in a spicy tomato-based gravy.', image: 'https://picsum.photos/seed/food4/100/100', calories: 600 },
    ],
    snacks: [
        { id: 'today-snacks-1', name: 'Samosa with Chutney', description: 'Fried pastry with a savory filling of spiced potatoes, onions, and peas.', image: 'https://picsum.photos/seed/food5/100/100', default: true, calories: 260 },
        { id: 'today-snacks-2', name: 'Vada Pav', description: 'Deep-fried potato dumpling placed inside a bread bun.', image: 'https://picsum.photos/seed/food6/100/100', calories: 300 },
    ],
    dinner: [
        { id: 'today-dinner-1', name: 'Chicken Biryani', description: 'A savory chicken and rice dish with spices.', image: 'https://picsum.photos/seed/food7/100/100', default: true, calories: 700 },
        { id: 'today-dinner-2', name: 'Dal Makhani with Naan', description: 'Creamy lentils with butter and spices, served with flatbread.', image: 'https://picsum.photos/seed/food8/100/100', calories: 650 },
    ]
  },
  Tom: {
    breakfast: [
      { id: 'tom-bf-1', name: 'Masala Dosa', description: 'A crisp and savory South Indian pancake, filled with spiced potatoes.', image: 'https://picsum.photos/seed/food9/100/100', default: true, calories: 300 },
      { id: 'tom-bf-2', name: 'Idli Sambar', description: 'Steamed rice cakes served with a tangy lentil soup.', image: 'https://picsum.photos/seed/food10/100/100', calories: 200 },
      { id: 'tom-bf-3', name: 'Skip Breakfast', description: 'Help us cut down food wastage' },
    ],
    lunch: [
      { id: 'tom-lunch-1', name: 'Chole Bhature', description: 'Spicy chickpeas with fluffy deep-fried bread.', image: 'https://picsum.photos/seed/food11/100/100', default: true, calories: 550 },
      { id: 'tom-lunch-2', name: 'Vegetable Pulao', description: 'A fragrant rice dish with mixed vegetables and spices.', image: 'https://picsum.photos/seed/food12/100/100', calories: 400 },
    ],
    snacks: [
      { id: 'tom-snacks-1', name: 'Khandvi', description: 'Savory rolls made from gram flour, tempered with mustard seeds.', image: 'https://picsum.photos/seed/food13/100/100', default: true, calories: 150 },
      { id: 'tom-snacks-2', name: 'Dhokla', description: 'A steamed and spongy cake made from fermented rice and chickpea batter.', image: 'https://picsum.photos/seed/food14/100/100', calories: 180 },
    ],
    dinner: [
      { id: 'tom-dinner-1', name: 'Paneer Butter Masala', description: 'Cottage cheese in a creamy tomato and butter sauce.', image: 'https://picsum.photos/seed/food15/100/100', default: true, calories: 680 },
      { id: 'tom-dinner-2', name: 'Fish Curry', description: 'A tangy and spicy fish curry, perfect with steamed rice.', image: 'https://picsum.photos/seed/food16/100/100', calories: 550 },
    ],
  },
  Thu: {
     breakfast: [
      { id: 'thu-bf-1', name: 'Upma', description: 'A thick porridge made from dry-roasted semolina.', image: 'https://picsum.photos/seed/food17/100/100', default: true, calories: 230 },
      { id: 'thu-bf-2', name: 'Bread Omelette', description: 'A simple yet delicious omelette sandwich.', image: 'https://picsum.photos/seed/food18/100/100', calories: 320 },
      { id: 'thu-bf-3', name: 'Skip Breakfast', description: 'Help us cut down food wastage' },
    ],
    lunch: [
      { id: 'thu-lunch-1', name: 'Baingan Bharta & Roti', description: 'Smoky mashed eggplant cooked with spices.', image: 'https://picsum.photos/seed/food19/100/100', default: true, calories: 450 },
      { id: 'thu-lunch-2', name: 'Lemon Rice', description: 'A tangy and flavorful rice dish with a hint of lemon and peanuts.', image: 'https://picsum.photos/seed/food20/100/100', calories: 380 },
    ],
    snacks: [
      { id: 'thu-snacks-1', name: 'Pakora', description: 'Assorted vegetables deep-fried in gram flour batter.', image: 'https://picsum.photos/seed/food21/100/100', default: true, calories: 200 },
      { id: 'thu-snacks-2', name: 'Aloo Chaat', description: 'Fried potato cubes tossed in spicy and tangy chutneys.', image: 'https://picsum.photos/seed/food22/100/100', calories: 250 },
    ],
    dinner: [
      { id: 'thu-dinner-1', name: 'Mutton Rogan Josh', description: 'A fragrant lamb curry with a rich gravy.', image: 'https://picsum.photos/seed/food23/100/100', default: true, calories: 750 },
      { id: 'thu-dinner-2', name: 'Vegetable Korma', description: 'Mixed vegetables in a creamy and mildly spiced sauce.', image: 'https://picsum.photos/seed/food24/100/100', calories: 500 },
    ]
  },
  Fri: {
     breakfast: [
      { id: 'fri-bf-1', name: 'Gobi Paratha', description: 'Flatbread stuffed with spiced cauliflower.', image: 'https://picsum.photos/seed/food25/100/100', default: true, calories: 300 },
      { id: 'fri-bf-2', name: 'Cheela', description: 'A savory pancake made from gram flour.', image: 'https://picsum.photos/seed/food26/100/100', calories: 220 },
      { id: 'fri-bf-3', name: 'Skip Breakfast', description: 'Help us cut down food wastage' },
    ],
    lunch: [
      { id: 'fri-lunch-1', name: 'Dal Tadka & Rice', description: 'Yellow lentils tempered with spices and ghee.', image: 'https://picsum.photos/seed/food27/100/100', default: true, calories: 480 },
      { id: 'fri-lunch-2', name: 'Bhindi Masala & Roti', description: 'Stir-fried okra with spices.', image: 'https://picsum.photos/seed/food28/100/100', calories: 420 },
    ],
    snacks: [
      { id: 'fri-snacks-1', name: 'Dahi Vada', description: 'Lentil dumplings soaked in creamy yogurt.', image: 'https://picsum.photos/seed/food29/100/100', default: true, calories: 280 },
      { id: 'fri-snacks-2', name: 'Bhel Puri', description: 'A savory snack made with puffed rice, vegetables, and a tangy tamarind sauce.', image: 'https://picsum.photos/seed/food30/100/100', calories: 350 },
    ],
    dinner: [
      { id: 'fri-dinner-1', name: 'Egg Curry', description: 'Boiled eggs cooked in a spicy onion and tomato gravy.', image: 'https://picsum.photos/seed/food31/100/100', default: true, calories: 550 },
      { id: 'fri-dinner-2', name: 'Malai Kofta', description: 'Potato and paneer balls in a rich, creamy sauce.', image: 'https://picsum.photos/seed/food32/100/100', calories: 650 },
    ]
  }
};

type MenuItem = {
    id: string;
    name: string;
    description: string;
    image?: string;
    default?: boolean;
    calories?: number;
}

export function FoodMenuCard() {
    const [selectedDay, setSelectedDay] = useState('Today');
    const [selectedMeal, setSelectedMeal] = useState<{ [key: string]: { [key: string]: string } }>({
      Today: { breakfast: 'today-bf-1', lunch: 'today-lunch-1', snacks: 'today-snacks-1', dinner: 'today-dinner-1' },
      Tom: { breakfast: 'tom-bf-1', lunch: 'tom-lunch-1', snacks: 'tom-snacks-1', dinner: 'tom-dinner-1' },
      Thu: { breakfast: 'thu-bf-1', lunch: 'thu-lunch-1', snacks: 'thu-snacks-1', dinner: 'thu-dinner-1' },
      Fri: { breakfast: 'fri-bf-1', lunch: 'fri-lunch-1', snacks: 'fri-snacks-1', dinner: 'fri-dinner-1' },
    });

    const handleSelectMeal = (mealType: string, itemId: string) => {
        setSelectedMeal(prev => ({
            ...prev,
            [selectedDay]: {
                ...prev[selectedDay],
                [mealType]: itemId
            }
        }));
    }
    
    const menu = menuData[selectedDay];
    const currentSelections = selectedMeal[selectedDay];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Menu for the week</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {days.map((day) => (
            <Button
              key={day.day}
              variant={selectedDay === day.day ? 'default' : 'outline'}
              className="h-auto w-full p-4 flex flex-col items-start"
              onClick={() => setSelectedDay(day.day)}
            >
              <div className="font-semibold">{day.day}</div>
              <div className="text-sm">{day.date}</div>
            </Button>
          ))}
        </div>

        <Tabs defaultValue="breakfast" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
                <TabsTrigger value="lunch">Lunch</TabsTrigger>
                <TabsTrigger value="snacks">Snacks</TabsTrigger>
                <TabsTrigger value="dinner">Dinner</TabsTrigger>
            </TabsList>
            <TabsContent value="breakfast">
                <RadioGroup value={currentSelections.breakfast} onValueChange={(value) => handleSelectMeal('breakfast', value)}>
                    <div className="space-y-4 pt-4">
                        {menu.breakfast.map((item: MenuItem) => (
                            <Label key={item.id} htmlFor={item.id} className={cn("flex items-center gap-4 rounded-lg border p-4 transition-all cursor-pointer", currentSelections.breakfast === item.id && "bg-accent/10 border-accent")}>
                                {item.image && (
                                    <Image data-ai-hint="food meal" src={item.image} alt={item.name} width={64} height={64} className="rounded-full" />
                                )}
                                {!item.image && item.name.toLowerCase().includes('skip') && (
                                     <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                        <Info className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        {item.default && <Badge variant="secondary" className="mb-1">Default</Badge>}
                                        {item.calories && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Flame className="h-3 w-3 text-orange-400" />
                                                <span>~{item.calories} kcal</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                                <RadioGroupItem value={item.id} id={item.id} />
                            </Label>
                        ))}
                    </div>
                </RadioGroup>
            </TabsContent>
             <TabsContent value="lunch">
                <RadioGroup value={currentSelections.lunch} onValueChange={(value) => handleSelectMeal('lunch', value)}>
                    <div className="space-y-4 pt-4">
                        {menu.lunch.map((item: MenuItem) => (
                            <Label key={item.id} htmlFor={item.id} className={cn("flex items-center gap-4 rounded-lg border p-4 transition-all cursor-pointer", currentSelections.lunch === item.id && "bg-accent/10 border-accent")}>
                                {item.image && (
                                    <Image data-ai-hint="indian food" src={item.image} alt={item.name} width={64} height={64} className="rounded-full" />
                                )}
                                <div className="flex-1">
                                     <div className="flex items-center gap-2">
                                        {item.default && <Badge variant="secondary" className="mb-1">Default</Badge>}
                                        {item.calories && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Flame className="h-3 w-3 text-orange-400" />
                                                <span>~{item.calories} kcal</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                                <RadioGroupItem value={item.id} id={item.id} />
                            </Label>
                        ))}
                    </div>
                </RadioGroup>
            </TabsContent>
            <TabsContent value="snacks">
                <RadioGroup value={currentSelections.snacks} onValueChange={(value) => handleSelectMeal('snacks', value)}>
                    <div className="space-y-4 pt-4">
                        {menu.snacks.map((item: MenuItem) => (
                            <Label key={item.id} htmlFor={item.id} className={cn("flex items-center gap-4 rounded-lg border p-4 transition-all cursor-pointer", currentSelections.snacks === item.id && "bg-accent/10 border-accent")}>
                                {item.image && (
                                    <Image data-ai-hint="indian snacks" src={item.image} alt={item.name} width={64} height={64} className="rounded-full" />
                                )}
                                <div className="flex-1">
                                     <div className="flex items-center gap-2">
                                        {item.default && <Badge variant="secondary" className="mb-1">Default</Badge>}
                                        {item.calories && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Flame className="h-3 w-3 text-orange-400" />
                                                <span>~{item.calories} kcal</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                                <RadioGroupItem value={item.id} id={item.id} />
                            </Label>
                        ))}
                    </div>
                </RadioGroup>
            </TabsContent>
            <TabsContent value="dinner">
                <RadioGroup value={currentSelections.dinner} onValueChange={(value) => handleSelectMeal('dinner', value)}>
                    <div className="space-y-4 pt-4">
                        {menu.dinner.map((item: MenuItem) => (
                            <Label key={item.id} htmlFor={item.id} className={cn("flex items-center gap-4 rounded-lg border p-4 transition-all cursor-pointer", currentSelections.dinner === item.id && "bg-accent/10 border-accent")}>
                                {item.image && (
                                    <Image data-ai-hint="indian dinner" src={item.image} alt={item.name} width={64} height={64} className="rounded-full" />
                                )}
                                <div className="flex-1">
                                     <div className="flex items-center gap-2">
                                        {item.default && <Badge variant="secondary" className="mb-1">Default</Badge>}
                                        {item.calories && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Flame className="h-3 w-3 text-orange-400" />
                                                <span>~{item.calories} kcal</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                                <RadioGroupItem value={item.id} id={item.id} />
                            </Label>
                        ))}
                    </div>
                </RadioGroup>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
