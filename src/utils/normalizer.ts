export class Normalizer {

  static normalizeText(value?: string): string {
    if (!value) return "";

    return value
      .toLowerCase()
      .trim()
      .replace(/[.,()]/g, "")      
      .replace(/\s+/g, " ");       
  }

}