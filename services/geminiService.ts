import { GoogleGenAI, Chat, Content } from "@google/genai";
import { VIVEKA_SYSTEM_PROMPT } from '../constants';
import { ChatMessage } from "../types";

// Assume process.env.API_KEY is available in the environment
if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. The app will not function correctly without a valid key.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

/**
 * Maps the application's message format to the Gemini API's history format.
 * @param messages - The array of chat messages from the application's state.
 * @returns An array of Content objects for the Gemini API.
 */
const mapMessagesToGeminiHistory = (messages: ChatMessage[]): Content[] => {
    return messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
};

/**
 * Creates and returns a new chat session instance, optionally initialized with a message history.
 * @param messages - An array of existing messages to load as history.
 * @returns A new Chat instance.
 */
export const startNewChatSession = (messages: ChatMessage[]): Chat => {
    const history = mapMessagesToGeminiHistory(messages);
    
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,
        config: {
            systemInstruction: VIVEKA_SYSTEM_PROMPT,
        },
    });
};


/**
 * Sends a message to the Gemini API in a streaming fashion.
 * @param chat - The chat instance to use for sending the message.
 * @param message - The user's message text.
 * @param onChunk - A callback function that receives each text chunk as it arrives.
 */
export const sendStreamedMessage = async (
    chat: Chat,
    message: string, 
    onChunk: (chunk: string) => void
): Promise<void> => {
    try {
        const responseStream = await chat.sendMessageStream({ message });
        for await (const chunk of responseStream) {
            onChunk(chunk.text);
        }
    } catch (error) {
        console.error("Error sending streamed message to Gemini:", error);
        onChunk("Maaf, sepertinya ada sedikit kendala. Bisakah kita coba lagi beberapa saat lagi?");
    }
};