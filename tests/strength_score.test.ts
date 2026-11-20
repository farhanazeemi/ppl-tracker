import { describe, it, expect } from 'vitest';
import {
  calculateDots,
  calculateWilks,
  calculateIpfGl,
  calculateNavyBodyFat,
  getStrengthClassification,
  getBodyFatCategory,
} from '../src/utils/strengthCalculators';

describe('Strength Calculators (openGym verified algorithms)', () => {
  it('calculates male DOTS score correctly', () => {
    // 500kg total at 82.5kg male
    const score = calculateDots(500, 82.5, 'male');
    expect(score).toBeDefined();
    expect(score).toBeGreaterThan(320);
    expect(score).toBeLessThan(360);
  });

  it('calculates female DOTS score correctly', () => {
    // 350kg total at 60kg female
    const score = calculateDots(350, 60, 'female');
    expect(score).toBeDefined();
    expect(score).toBeGreaterThan(350);
  });

  it('returns null for non-positive or invalid inputs', () => {
    expect(calculateDots(0, 80, 'male')).toBeNull();
    expect(calculateDots(500, -5, 'male')).toBeNull();
    expect(calculateDots(NaN, 80, 'male')).toBeNull();
  });

  it('calculates Wilks score within historical standards', () => {
    const wilks = calculateWilks(500, 80, 'male');
    expect(wilks).toBeDefined();
    expect(wilks).toBeGreaterThan(300);
    expect(wilks).toBeLessThan(400);
  });

  it('calculates IPF GL points accurately', () => {
    const gl = calculateIpfGl(500, 80, 'male');
    expect(gl).toBeDefined();
    expect(gl).toBeGreaterThan(60);
    expect(gl).toBeLessThan(100);
  });

  it('classifies strength tiers properly based on DOTS', () => {
    const novice = getStrengthClassification(250, 'male');
    expect(novice.tier).toBe('Novice');

    const intermediate = getStrengthClassification(300, 'male');
    expect(intermediate.tier).toBe('Intermediate');

    const advanced = getStrengthClassification(380, 'male');
    expect(advanced.tier).toBe('Advanced');

    const elite = getStrengthClassification(460, 'male');
    expect(elite.tier).toBe('Elite');

    const international = getStrengthClassification(520, 'male');
    expect(international.tier).toBe('International');
  });

  it('calculates US Navy Body Fat % for male and female', () => {
    // Male: 178cm height, 38cm neck, 84cm waist
    const maleBf = calculateNavyBodyFat({
      sex: 'male',
      heightCm: 178,
      neckCm: 38,
      waistCm: 84,
    });
    expect(maleBf).toBeDefined();
    expect(maleBf).toBeGreaterThan(12);
    expect(maleBf).toBeLessThan(18);

    const maleCat = getBodyFatCategory(maleBf!, 'male');
    expect(maleCat.category).toBe('Fitness');

    // Female: 165cm height, 32cm neck, 72cm waist, 96cm hip
    const femaleBf = calculateNavyBodyFat({
      sex: 'female',
      heightCm: 165,
      neckCm: 32,
      waistCm: 72,
      hipCm: 96,
    });
    expect(femaleBf).toBeDefined();
    expect(femaleBf).toBeGreaterThan(20);
    expect(femaleBf).toBeLessThan(28);
  });

  it('rejects invalid or impossible body circumferences safely', () => {
    // Waist smaller than neck is physically impossible for Navy formula
    expect(calculateNavyBodyFat({ sex: 'male', heightCm: 180, neckCm: 40, waistCm: 35 })).toBeNull();
  });
});
