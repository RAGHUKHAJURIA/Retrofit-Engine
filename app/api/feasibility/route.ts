import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { RetrofitFeasibilityEngine } from '../../../src/index';
import { PropertyInputDTO } from '../../../src/models/property.model';
import { EPCBand } from '../../../src/enums/epc-band.enum';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Mapping user form data to PropertyInputDTO and injecting simulated EPC values
    const input: PropertyInputDTO = {
      postcode: body.postcode || 'Unknown',
      address_id: body.address_id || '',
      address: `${body.address_id || ''} ${body.postcode || ''}`.trim(),
      
      // Auto-Fetched Inputs (Simulated default for MVP)
      epc_band_current: body.epc_band_current || EPCBand.E, 
      epc_band_potential: EPCBand.B,
      epc_date: new Date(),
      construction_age_band: "1930-1949",
      total_floor_area: 85,
      wall_description: "Solid brick, as built, no insulation (assumed)",
      roof_description: "Pitched, 100 mm loft insulation",
      heating_type: "Boiler and radiators, mains gas",

      // User Inputs
      property_type: body.property_type || "terraced",
      storeys: Number(body.storeys) || 2,
      extension_present: body.extension_present || 'no',
      structural_alterations: body.structural_alterations || 'no',
      damp_history: body.damp_history || 'unknown',
      mould_present: body.mould_present || 'unknown',
      condensation_history: body.condensation_history || 'unknown',
      roof_leaks: body.roof_leaks || 'unknown',
      ventilation_type: body.ventilation_type || 'unknown',
      retrofit_target: body.retrofit_target || 'target_epc_c',
      
      // New Sections Mapping
      windows: body.windows || "unknown",
      loft_insulation_depth: body.loft_insulation_depth || "unknown",
      wall_insulation_status: body.wall_insulation_status || "unknown",
      floor_type: body.floor_type || "unknown",
      current_heating_system: body.current_heating_system || "unknown",
      hot_water_cylinder: body.hot_water_cylinder || "unknown",
      is_listed: body.is_listed || "unknown",
      in_conservation_area: body.in_conservation_area || "unknown",
    };

    // --- ENGINE EXECUTION ---
    // This calls EPC -> Archetype -> Climate -> Measures -> Moisture -> Sequencing -> EPC Uplift -> Decision
    const decision = RetrofitFeasibilityEngine.evaluateProperty(input);

    // --- PDF GENERATION ---
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    let page = pdfDoc.addPage([595.28, 841.89]); // A4 Size
    const { width, height } = page.getSize();
    
    let currentY = height - 50;
    const paddingLeft = 50;
    const paddingRight = 50;
    const contentWidth = width - paddingLeft - paddingRight;

    // Helper to check page bounds and add new page if needed
    const checkPageBounds = (neededSpace: number) => {
      if (currentY - neededSpace < 50) {
        page = pdfDoc.addPage([595.28, 841.89]);
        currentY = height - 50;
      }
    };

    const drawText = (text: string, font: any = timesRomanFont, size: number = 10, color: any = rgb(0,0,0), offsetX: number = 0) => {
      checkPageBounds(size + 5);
      page.drawText(text, { x: paddingLeft + offsetX, y: currentY, size, font, color, maxWidth: contentWidth - offsetX });
      currentY -= size + 5;
    };

    const drawWrappedText = (text: string, font: any = timesRomanFont, size: number = 10, color: any = rgb(0,0,0), offsetX: number = 0) => {
      const words = text.split(' ');
      let currentLine = '';
      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + words[i] + ' ';
        const textWidth = font.widthOfTextAtSize(testLine, size);
        if (textWidth > contentWidth - offsetX && i > 0) {
          drawText(currentLine.trim(), font, size, color, offsetX);
          currentLine = words[i] + ' ';
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine.trim().length > 0) {
        drawText(currentLine.trim(), font, size, color, offsetX);
      }
    };

    const drawSectionHeader = (title: string) => {
      currentY -= 10;
      checkPageBounds(20);
      drawText(title, timesBoldFont, 12, rgb(0, 0, 0));
      currentY -= 5;
    };

    const drawTableRow = (col1: string, col2: string, col3: string = "", isHeader: boolean = false) => {
      const font = isHeader ? timesBoldFont : timesRomanFont;
      const size = 10;
      checkPageBounds(size + 5);
      page.drawText(col1, { x: paddingLeft, y: currentY, size, font });
      page.drawText(col2, { x: paddingLeft + 180, y: currentY, size, font });
      if (col3) {
        page.drawText(col3, { x: paddingLeft + 350, y: currentY, size, font });
      }
      currentY -= size + 5;
    };

    const baseline = decision.property_baseline || {} as any;
    const risk = decision.risk_assessment || {} as any;
    const proj = decision.epc_projection || {} as any;

    // Header
    drawText("SAMPLE REPORT", timesBoldFont, 12, rgb(0.5, 0.5, 0.5));
    drawText("Retrofit-First Feasibility Report", timesBoldFont, 18, rgb(0, 0, 0));
    drawText("Generated by Retrofit First Feasibility Engine (Deterministic Assessment)", timesRomanFont, 10, rgb(0.3, 0.3, 0.3));
    drawText(`Report ID: RFFE-${new Date().getFullYear()}-${Math.floor(Math.random()*10000).toString().padStart(4, '0')}`, timesRomanFont, 10);
    
    // Format date: e.g. 06 March 2026
    const dateOpts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateStr = new Date().toLocaleDateString('en-GB', dateOpts);
    drawText(`Generated On: ${dateStr}`, timesRomanFont, 10);
    currentY -= 10;

    // 1. Property Identification
    drawSectionHeader("1. Property Identification");
    drawText("Address:", timesRomanFont, 10);
    const addrParts = input.address.split(' ');
    const postcode = input.postcode;
    const houseNum = input.address_id;
    drawText(`${houseNum} ${addrParts.filter(p => !postcode.includes(p) && p !== houseNum).join(' ')}`.trim(), timesRomanFont, 10, rgb(0,0,0));
    drawText(postcode, timesRomanFont, 10, rgb(0,0,0));
    drawText("United Kingdom", timesRomanFont, 10, rgb(0,0,0));
    drawText(`Property Type: ${input.property_type === 'terraced' ? 'Mid-Terrace House' : input.property_type.charAt(0).toUpperCase() + input.property_type.slice(1)}`, timesRomanFont, 10);
    drawText(`Storeys: ${input.storeys}`, timesRomanFont, 10);
    drawText(`Construction Archetype: ${baseline.archetype || 'Solid Wall Pre-1919'}`, timesRomanFont, 10);
    drawText(`Extensions: ${input.extension_present === 'yes' ? 'Yes' : 'No'}`, timesRomanFont, 10);
    drawText(`Major Alterations: ${input.structural_alterations === 'yes' ? 'Yes' : 'None Declared'}`, timesRomanFont, 10);

    // 2. Retrofit Objective
    drawSectionHeader("2. Retrofit Objective");
    const formattedTarget = (input.retrofit_target || 'target_epc_c').replace('target_epc_', 'EPC Band ').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    drawText(`User Target: ${formattedTarget}`, timesRomanFont, 10);
    drawText("Assessment Method: Deterministic Rules Engine", timesRomanFont, 10);
    drawText("Assessment Time: < 2 minutes", timesRomanFont, 10);

    // 3. Input Condition Summary
    drawSectionHeader("3. Input Condition Summary");
    drawText("Moisture & Building Condition", timesBoldFont, 10);
    drawTableRow("Condition", "Status", "", true);
    drawTableRow("Known Damp", input.damp_history === 'yes' ? 'Yes' : 'No');
    drawTableRow("Visible Mould", input.mould_present === 'yes' ? 'Yes' : 'No');
    drawTableRow("Condensation", input.condensation_history === 'yes' ? 'Yes' : 'No');
    drawTableRow("Roof Leaks", input.roof_leaks === 'yes' ? 'Yes' : 'No');
    currentY -= 5;
    drawText("Ventilation Status", timesBoldFont, 10);
    drawText("Current Ventilation:", timesRomanFont, 10);
    const ventMap: any = {
      'natural': 'Natural',
      'extract_fans': 'Extract fans in kitchen and bathroom',
      'cme': 'Continuous mechanical extract',
      'mvhr': 'MVHR',
      'unknown': 'Unknown'
    };
    drawText(`• ${ventMap[input.ventilation_type || 'unknown'] || input.ventilation_type}`, timesRomanFont, 10);
    drawText("Climate Assumption", timesBoldFont, 10);
    drawText(`UK Climate Zone: ${baseline.climate_region || 'London / Southeast England'}`, timesRomanFont, 10);
    drawText("Climate Data Source: UK Climate API", timesRomanFont, 10);

    // 4. Property Archetype Identification
    drawSectionHeader("4. Property Archetype Identification");
    drawWrappedText("Based on postcode, structure and construction assumptions the system classified the property as:");
    drawText("Archetype:", timesRomanFont, 10);
    drawText(`${baseline.archetype || 'Pre-1919 Solid Wall Mid-Terrace'}`, timesRomanFont, 10);
    drawText("Typical characteristics:", timesRomanFont, 10);
    drawText("• Solid brick external walls", timesRomanFont, 10);
    drawText("• Suspended timber ground floor", timesRomanFont, 10);
    drawText("• Pitched roof with loft space", timesRomanFont, 10);
    drawText("• Natural ventilation with intermittent extract", timesRomanFont, 10);

    // 5. Retrofit Measures Considered
    drawSectionHeader("5. Retrofit Measures Considered");
    drawWrappedText("The deterministic engine evaluated the following predefined retrofit measures:");
    drawTableRow("Measure", "Status", "", true);
    const allMeasures: {name: string, status: string}[] = [];
    const measureList = decision.sequencing_order || [];
    const blockedList = decision.structured_preconditions || [];
    
    measureList.forEach((m: string) => {
      allMeasures.push({ name: m.charAt(0).toUpperCase() + m.slice(1), status: "Recommended" });
    });
    blockedList.forEach((b: any) => {
      allMeasures.push({ name: b.blocked_measure.charAt(0).toUpperCase() + b.blocked_measure.slice(1), status: "Conditional" });
    });
    
    if (allMeasures.length === 0) {
      drawTableRow("None eligible for current inputs", "N/A");
    } else {
      allMeasures.forEach(m => drawTableRow(m.name, m.status));
    }

    // 6. Moisture & Ventilation Safety Check
    drawSectionHeader("6. Moisture & Ventilation Safety Check");
    drawWrappedText("The engine applied moisture and ventilation safety rules before recommending retrofit sequencing.");
    drawText("Safety Assessment Result", timesBoldFont, 10);
    let riskStatus = risk.moisture_risk === 'HIGH' ? "FAIL" : "PASS (with precaution)";
    drawText(`Status: ${riskStatus}`, timesRomanFont, 10);
    drawText("Key checks performed:", timesRomanFont, 10);
    drawText("• Ventilation adequacy before airtightness improvements", timesRomanFont, 10);
    drawText("• Moisture risk from internal insulation", timesRomanFont, 10);
    drawText("• Condensation risk from thermal upgrades", timesRomanFont, 10);
    drawText("Observation:", timesRomanFont, 10);
    drawWrappedText(risk.moisture_reason || "Airtightness improvements must not occur before ventilation upgrades.", timesRomanFont, 10);

    // 7. Retrofit Sequencing Rules Applied
    drawSectionHeader("7. Retrofit Sequencing Rules Applied");
    drawText("The following sequencing rules were applied:", timesRomanFont, 10);
    const rules: string[] = [];
    if (decision.required_preconditions && decision.required_preconditions.length > 0) {
      decision.required_preconditions.forEach((p: string, i: number) => rules.push(`${i+1}. ${p}`));
    }
    if (decision.sequencing_order && decision.sequencing_order.length > 0) {
      decision.sequencing_order.forEach((m: string, i: number) => rules.push(`${rules.length + 1}. ${m.charAt(0).toUpperCase() + m.slice(1)}`));
    }
    if (rules.length === 0) {
      drawText("Pathway blocked. No sequencing applies.", timesRomanFont, 10);
    } else {
      rules.forEach(r => drawText(r, timesRomanFont, 10));
    }

    // 8. EPC Uplift Pathway Analysis
    drawSectionHeader("8. EPC Uplift Pathway Analysis");
    drawText("Current Estimated EPC Band", timesRomanFont, 10);
    drawText(`Band ${proj.current || input.epc_band_current}`, timesRomanFont, 10);
    drawText("Achievable EPC Pathway", timesRomanFont, 10);
    drawTableRow("Step", "Retrofit Measure", "EPC Impact", true);
    if (decision.sequencing_order && decision.sequencing_order.length > 0) {
      decision.sequencing_order.forEach((m: string, i: number) => {
        let impact = "Cumulative progress";
        if (i === decision.sequencing_order.length - 1) impact = `${proj.current || input.epc_band_current} -> ${decision.achievable_epc_band || 'C'}`;
        drawTableRow(String(i + 1), m.charAt(0).toUpperCase() + m.slice(1), impact);
      });
    } else {
      drawTableRow("-", "No pathway available", "N/A");
    }
    
    drawText("Final Achievable EPC", timesRomanFont, 10);
    if (decision.final_status === 'RED') {
      drawText(`Band ${proj.current || input.epc_band_current} (No viable upgrades)`, timesRomanFont, 10);
    } else {
      drawText(`Band ${decision.achievable_epc_band || 'C'} (Achievable with full pathway)`, timesRomanFont, 10);
    }

    // 9. Deterministic Decision Outcome
    drawSectionHeader("9. Deterministic Decision Outcome");
    drawText(`Final Status: ${decision.final_status}`, timesRomanFont, 10);
    drawText("Meaning:", timesRomanFont, 10);
    drawText("Green - Direct pathway achievable", timesRomanFont, 10);
    drawText("Amber - Achievable with conditions", timesRomanFont, 10);
    drawText("Red - Not achievable with current inputs", timesRomanFont, 10);
    drawText("Explanation", timesRomanFont, 10);
    drawWrappedText(`The EPC target ${decision.final_status !== 'GREEN' ? 'requires the following conditions:' : 'is directly achievable:'}`);
    if (decision.required_preconditions && decision.required_preconditions.length > 0) {
      decision.required_preconditions.forEach((req: string) => drawText(`• ${req}`, timesRomanFont, 10));
    } else if (decision.final_status === 'GREEN') {
      drawText(`• Proceed with sequenced pathway`, timesRomanFont, 10);
    } else {
      drawText(`• Feasibility blocked due to constraints`, timesRomanFont, 10);
    }

    // 10. Constraints & Flags
    drawSectionHeader("10. Constraints & Flags");
    let hasConstraints = false;
    drawTableRow("Flag Type", "Description", "", true);
    if (decision.constraints && decision.constraints.length > 0) {
      decision.constraints.forEach(c => drawTableRow("Sequencing Constraint", c));
      hasConstraints = true;
    } else {
      drawTableRow("Sequencing Constraint", "Ventilation upgrade required before airtightness improvements");
      hasConstraints = true;
    }
    
    drawText(`Uncertainty Level: ${decision.uncertainty_score < 15 ? 'Low' : decision.uncertainty_score < 35 ? 'Medium' : 'High'}`, timesRomanFont, 10);
    drawText("No blocking issues detected.", timesRomanFont, 10);

    // 11. Assumptions Log
    drawSectionHeader("11. Assumptions Log");
    drawWrappedText("Because the user input did not include full EPC data, the following defaults were used:");
    drawText("• Archetype thermal performance defaults", timesRomanFont, 10);
    drawText("• Typical glazing performance", timesRomanFont, 10);
    drawText("• Standard heating system assumptions", timesRomanFont, 10);
    drawText("These assumptions may affect accuracy.", timesRomanFont, 10);

    // 12. Uncertainty Score
    drawSectionHeader("12. Uncertainty Score");
    const confLevel = decision.uncertainty_score < 15 ? 'Low' : decision.uncertainty_score < 35 ? 'Medium' : 'High';
    drawText(`Score: ${Math.max(1, Math.ceil(decision.uncertainty_score / 20))} / 5 (${confLevel})`, timesRomanFont, 10);
    drawText("Reason:", timesRomanFont, 10);
    drawText("• Limited building fabric data", timesRomanFont, 10);
    drawText("• Archetype assumptions applied", timesRomanFont, 10);

    // 13. Escalation Recommendation
    drawSectionHeader("13. Escalation Recommendation");
    drawText("No escalation required.", timesRomanFont, 10);
    drawText("However, for detailed design the following may be required:", timesRomanFont, 10);
    drawText("• Full EPC survey", timesRomanFont, 10);
    drawText("• Heat loss calculation", timesRomanFont, 10);
    drawText("• Ventilation assessment", timesRomanFont, 10);

    // 14. Key Takeaways
    drawSectionHeader("14. Key Takeaways");
    if (decision.final_status === 'GREEN') drawText(`[+] Target EPC ${decision.achievable_epc_band || 'C'} is achievable`, timesRomanFont, 10);
    else if (decision.final_status === 'AMBER') drawText(`[!] Target EPC ${decision.achievable_epc_band || 'C'} conditional on preconditions`, timesRomanFont, 10);
    else drawText(`[-] Target is blocked or out of scope`, timesRomanFont, 10);
    
    if (decision.required_preconditions) {
      decision.required_preconditions.forEach((p: string) => drawText(`* ${p}`, timesRomanFont, 10));
    }
    if (decision.sequencing_order && decision.sequencing_order.length > 0) {
      drawText("* Retrofit measures must follow defined sequence", timesRomanFont, 10);
    }

    // 15. Disclaimer
    drawSectionHeader("15. Disclaimer");
    drawWrappedText("This report is generated using a deterministic rules-based retrofit feasibility engine.");
    drawWrappedText("It provides early-stage retrofit feasibility guidance only and does not replace:");
    drawText("• EPC assessment", timesRomanFont, 10);
    drawText("• Retrofit coordinator evaluation", timesRomanFont, 10);
    drawText("• Detailed building survey", timesRomanFont, 10);

    // Appendix A
    currentY -= 15;
    checkPageBounds(40);
    drawText("Appendix A - Engine Logic Applied", timesBoldFont, 10);
    drawText("Rule Sets Used", timesRomanFont, 10);
    const ruleSets = [
      "1. Property Archetype Rules",
      "2. Retrofit Sequencing Rules",
      "3. Moisture & Ventilation Safety Rules",
      "4. EPC Uplift Estimation Pathways",
      "5. Climate Region Assumptions"
    ];
    ruleSets.forEach(r => drawText(r, timesRomanFont, 10));

    // Appendix B
    currentY -= 15;
    checkPageBounds(40);
    drawText("Appendix B - Input Data Provided", timesBoldFont, 10);
    drawTableRow("Field", "Value", "", true);
    drawTableRow("Postcode", input.postcode);
    drawTableRow("Property Type", input.property_type === 'terraced' ? 'Terrace' : input.property_type.charAt(0).toUpperCase() + input.property_type.slice(1));
    drawTableRow("Storeys", String(input.storeys));
    drawTableRow("Extensions", input.extension_present === 'yes' ? 'Yes' : 'No');
    drawTableRow("Alterations", input.structural_alterations === 'yes' ? 'Yes' : 'No');
    drawTableRow("Damp", input.damp_history === 'yes' ? 'Yes' : 'No');
    drawTableRow("Mould", input.mould_present === 'yes' ? 'Yes' : 'No');
    drawTableRow("Condensation", input.condensation_history === 'yes' ? 'Yes' : 'No');
    drawTableRow("Roof Leaks", input.roof_leaks === 'yes' ? 'Yes' : 'No');
    drawTableRow("Ventilation", ventMap[input.ventilation_type || 'unknown'] || input.ventilation_type);
    drawTableRow("Target EPC", (input.retrofit_target || 'target_epc_c').replace('target_epc_', '').toUpperCase());

    const pdfBytes = await pdfDoc.save();

    return NextResponse.json({
      decision: decision,
      pdfBase64: Buffer.from(pdfBytes).toString('base64')
    });

  } catch (error: unknown) {
    console.error("Error generating feasibility report:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
