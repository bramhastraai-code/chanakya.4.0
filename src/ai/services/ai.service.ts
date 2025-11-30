import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  GenerateDescriptionDto,
  EstimatePriceDto,
  ChatDto,
} from '../dto/v1/ai.dto';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private readonly logger = new Logger(AiService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    } else {
      this.logger.warn(
        'OPENAI_API_KEY not found. AI features will use mock responses.',
      );
    }
  }

  /**
   * Generate engaging property description
   */
  async generateDescription(dto: GenerateDescriptionDto) {
    const prompt = `
      Write a professional and engaging real estate property description for the following property:
      Type: ${dto.propertyType}
      Configuration: ${dto.configuration}
      Location: ${dto.location}
      Amenities: ${dto.amenities.join(', ')}
      Highlights: ${dto.highlights || 'None'}
      
      The description should be persuasive, highlighting the lifestyle and benefits. Keep it under 200 words.
    `;

    if (!this.openai) {
      return {
        description: `(Mock AI Response) Experience luxury living in this stunning ${dto.configuration} ${dto.propertyType} located in the heart of ${dto.location}. Featuring world-class amenities like ${dto.amenities.join(', ')}, this property offers the perfect blend of comfort and convenience. ${dto.highlights ? 'Highlights include ' + dto.highlights + '.' : ''} Don't miss this opportunity to own your dream home!`,
        isMock: true,
      };
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
      });

      return {
        description: response.choices[0].message.content.trim(),
        isMock: false,
      };
    } catch (error) {
      this.logger.error('OpenAI API Error', error);
      throw new Error('Failed to generate description');
    }
  }

  /**
   * Estimate property price (Market Valuation)
   */
  async estimatePrice(dto: EstimatePriceDto) {
    const prompt = `
      Estimate the current market price range for a property with the following details in India:
      Location: ${dto.location}
      Size: ${dto.sizeSqft} sqft
      Type: ${dto.propertyType}
      Configuration: ${dto.configuration}
      
      Provide the response in JSON format with fields: "minPrice" (number in INR), "maxPrice" (number in INR), "confidence" (percentage), and "reasoning" (string).
      Do not include markdown formatting.
    `;

    if (!this.openai) {
      // Mock logic: Base price 5000/sqft + random variation
      const baseRate = 5000;
      const estimatedValue = dto.sizeSqft * baseRate;
      return {
        minPrice: estimatedValue * 0.9,
        maxPrice: estimatedValue * 1.1,
        confidence: 85,
        reasoning: '(Mock AI) Based on average market rates in the area.',
        isMock: true,
      };
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
      });

      const content = response.choices[0].message.content.trim();
      // Attempt to parse JSON
      try {
        const json = JSON.parse(content);
        return { ...json, isMock: false };
      } catch (e) {
        return {
          rawResponse: content,
          isMock: false,
          note: 'Failed to parse JSON response',
        };
      }
    } catch (error) {
      this.logger.error('OpenAI API Error', error);
      throw new Error('Failed to estimate price');
    }
  }

  /**
   * Chanakya Chatbot
   */
  async chat(dto: ChatDto) {
    const systemPrompt = `
      You are Chanakya, a wise and knowledgeable real estate advisor for the 'Chanakya AI' platform.
      You help users with buying, selling, and renting properties in India.
      Your tone is professional, helpful, and slightly formal (like a wise mentor).
      Context: ${dto.context || 'None'}
    `;

    if (!this.openai) {
      return {
        response: `(Mock Chanakya) Namaste! I see you are asking about "${dto.message}". As an AI advisor, I suggest looking at properties in developing corridors for better ROI. How else can I assist you today?`,
        isMock: true,
      };
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: dto.message },
        ],
        max_tokens: 300,
      });

      return {
        response: response.choices[0].message.content.trim(),
        isMock: false,
      };
    } catch (error) {
      this.logger.error('OpenAI API Error', error);
      throw new Error('Failed to process chat message');
    }
  }
}
