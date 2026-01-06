'use server';

/**
 * @fileOverview AI agent that generates personalized study suggestions for students.
 *
 * - generateStudySuggestions - A function that generates study suggestions based on student data.
 * - GenerateStudySuggestionsInput - The input type for the generateStudySuggestions function.
 * - GenerateStudySuggestionsOutput - The return type for the generateStudySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudySuggestionsInputSchema = z.object({
  freeSlotDuration: z
    .string()
    .describe('The duration of the free time slot available to the student.'),
  academicWeakness: z
    .string()
    .describe(
      'The specific academic area or subject where the student needs improvement.'
    ),
  hostelConditions: z
    .string()
    .describe(
      'The current conditions in the hostel, such as noise level and available study spaces.'
    ),
  pastBehavior: z
    .string()
    .describe(
      'A summary of the student’s past study habits and preferences, to personalize the suggestions.'
    ),
});
export type GenerateStudySuggestionsInput = z.infer<
  typeof GenerateStudySuggestionsInputSchema
>;

const GenerateStudySuggestionsOutputSchema = z.object({
  studySuggestions: z
    .array(z.string())
    .describe(
      'A list of personalized study suggestions that takes into account the student’s free time, academic weaknesses, and hostel conditions.'
    ),
});
export type GenerateStudySuggestionsOutput = z.infer<
  typeof GenerateStudySuggestionsOutputSchema
>;

export async function generateStudySuggestions(
  input: GenerateStudySuggestionsInput
): Promise<GenerateStudySuggestionsOutput> {
  return generateStudySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudySuggestionsPrompt',
  input: {schema: GenerateStudySuggestionsInputSchema},
  output: {schema: GenerateStudySuggestionsOutputSchema},
  prompt: `You are a helpful AI assistant designed to provide personalized study suggestions for university students.

  Consider the following information about the student:

  - Free time available: {{{freeSlotDuration}}}
  - Academic weakness: {{{academicWeakness}}}
  - Hostel conditions: {{{hostelConditions}}}
  - Past study behavior: {{{pastBehavior}}}

  Based on this information, generate a list of specific and actionable study suggestions that the student can complete in the available free time.

  The suggestions should be supportive and encouraging, focusing on short, achievable tasks. Avoid generic advice and use student-friendly language.
  Format the suggestions as a list of bullet points.
  Do not provide any medical or diagnostic claims.
  `,
});

const generateStudySuggestionsFlow = ai.defineFlow(
  {
    name: 'generateStudySuggestionsFlow',
    inputSchema: GenerateStudySuggestionsInputSchema,
    outputSchema: GenerateStudySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
