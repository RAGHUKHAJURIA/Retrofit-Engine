import { PropertyInputDTO } from "../../models/property.model";
import { Normalizer } from "../../utils/normalizer";
import { Archetype } from "../../models/archetype.model";
import { ARCHETYPE_RULES, UNKNOWN_ARCHETYPE, ArchetypeRuleCondition } from "../config/archetype-rules";

export class ArchetypeEngine {
  
  /**
   * Classify a property into an archetype based on predefined rules.
   * Uses "first match wins" logic.
   * 
   * @param input Data representing the building characteristics 
   * @returns Resolves to matched Archetype, or UNKNOWN archetype if no match
   */
  public static classify(input: Partial<PropertyInputDTO>): Archetype {
    for (const rule of ARCHETYPE_RULES) {
      if (ArchetypeEngine.matches(rule.conditions, input)) {
        return rule.archetype;
      }
    }
    
    return UNKNOWN_ARCHETYPE;
  }

  private static matches(
    conditions: ArchetypeRuleCondition,
    input: Partial<PropertyInputDTO>
  ): boolean {
  
    const inputAge = Normalizer.normalizeText(input.construction_age_band);
    const inputPropertyType = Normalizer.normalizeText(input.property_type);
    const inputWall = Normalizer.normalizeText(input.wall_description);
    const inputRoof = Normalizer.normalizeText(input.roof_description);
  
    const conditionAge = Normalizer.normalizeText(conditions.construction_age_band);
    const conditionPropertyType = Normalizer.normalizeText(conditions.property_type);
    const conditionWall = Normalizer.normalizeText(conditions.wall_description);
    const conditionRoof = Normalizer.normalizeText(conditions.roof_description);
  
    if (conditionAge && conditionAge !== inputAge) {
      return false;
    }
  
    if (conditionPropertyType && conditionPropertyType !== inputPropertyType) {
      return false;
    }
  
    if (conditionWall && !inputWall.includes(conditionWall)) {
      return false;
    }
  
    if (conditionRoof && !inputRoof.includes(conditionRoof)) {
      return false;
    }
  
    return true;
  }
}
