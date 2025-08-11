import { type Game, type InsertGame, type Task, type TaskCategory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createGame(game: InsertGame): Promise<Game>;
  getGame(id: string): Promise<Game | undefined>;
  updateGame(id: string, updates: Partial<Game>): Promise<Game | undefined>;
  getTasksByCategory(category: TaskCategory): Task[];
}

export class MemStorage implements IStorage {
  private games: Map<string, Game>;
  private tasks: Task[];

  constructor() {
    this.games = new Map();
    this.initializeTasks();
  }

  private initializeTasks() {
    this.tasks = [
      // Spicy tasks
      { id: "1", text: "Kerro salaisuus - jos et, juo 3 huikkaa 🤫", category: "spicy" },
      { id: "2", text: "Anna suudelma poskelle - jos et, juo 2 huikkaa 💋", category: "spicy" },
      { id: "3", text: "Kerro keneen olet ihastunut - jos et, juo 4 huikkaa 💕", category: "spicy" },
      { id: "4", text: "Tee push-up - jos et pysty, juo 3 huikkaa 💪", category: "spicy" },
      { id: "5", text: "Soita ex:llesi - jos et, juo 5 huikkaa 📱", category: "spicy" },
      { id: "6", text: "Näytä vatsalihas - jos ei ole, juo 2 huikkaa 🏋️", category: "spicy" },
      { id: "7", text: "Kerro noloin muistosi - jos et, juo 3 huikkaa 😳", category: "spicy" },
      { id: "8", text: "Anna jollekin hieronta - jos et, juo 2 huikkaa 💆", category: "spicy" },

      // Funny tasks
      { id: "9", text: "Jäljittele jotakuta pöydässä - muut arvaa kuka 🎭", category: "funny" },
      { id: "10", text: "Puhu minuutin ajan vain eläinten äänillä 🐶", category: "funny" },
      { id: "11", text: "Tee standup-komiikka numero 🎤", category: "funny" },
      { id: "12", text: "Laula suosikkikappaleesi operatyyliin 🎵", category: "funny" },
      { id: "13", text: "Esitä pantomiimi 'kala vedessä' 🐟", category: "funny" },
      { id: "14", text: "Kerro vitsi - jos kukaan ei naura, juo 2 huikkaa 😄", category: "funny" },
      { id: "15", text: "Tee TikTok-tanssi 💃", category: "funny" },
      { id: "16", text: "Puhu 30 sekuntia nenään äänellä 👃", category: "funny" },

      // Party tasks
      { id: "17", text: "Kaikki pöydän ympärillä juovat! 🍻", category: "party" },
      { id: "18", text: "Tee uusi juomisääntö koko porukalle 📜", category: "party" },
      { id: "19", text: "Aloita 'Never Have I Ever' -kierros 🙈", category: "party" },
      { id: "20", text: "Kaikki miehet juovat! 🍺", category: "party" },
      { id: "21", text: "Kaikki naiset juovat! 🥂", category: "party" },
      { id: "22", text: "Sinun oikealla puolellasi oleva juo 2 huikkaa ➡️", category: "party" },
      { id: "23", text: "Kaikki, joilla on siniset silmät, juovat! 👁️", category: "party" },
      { id: "24", text: "Ota 3 huikkaa ja anna 3 huikkaa jollekin 🔄", category: "party" },
      { id: "25", text: "Kaikki, joilla on puhelin kädessä, juovat! 📱", category: "party" },
      { id: "26", text: "Vaihda paikkaa jonkun kanssa ja molemmat juotte! 🔄", category: "party" },
    ];
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = randomUUID();
    const game: Game = { 
      ...insertGame, 
      id,
      currentPlayerIndex: 0 
    };
    this.games.set(id, game);
    return game;
  }

  async getGame(id: string): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async updateGame(id: string, updates: Partial<Game>): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;
    
    const updatedGame = { ...game, ...updates };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  getTasksByCategory(category: TaskCategory): Task[] {
    return this.tasks.filter(task => task.category === category);
  }
}

export const storage = new MemStorage();
