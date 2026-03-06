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

    // Helper to check page bounds and add new page if needed
    const checkPageBounds = (neededSpace: number) => {
      if (currentY - neededSpace < 50) {
        page = pdfDoc.addPage([595.28, 841.89]);
        currentY = height - 50;
      }
    };

    const drawText = (text: string, font: any = timesRomanFont, size: number = 12, color: any = rgb(0,0,0), wrap: boolean = false) => {
      checkPageBounds(size + 10);
      page.drawText(text, { x: paddingLeft, y: currentY, size, font, color, maxWidth: width - (paddingLeft * 2) });
      // Very basic approach for line break if wrap was truly needed, but keeping it simple
      currentY -= size + 8;
    };

    const drawSectionHeader = (title: string) => {
      checkPageBounds(30);
      currentY -= 10;
      drawText(title, timesBoldFont, 16, rgb(0.06, 0.3, 0.23)); // #0F4C3A
      currentY -= 5;
    };

    // Header
    drawText("Retrofit-First Feasibility Report", timesBoldFont, 24, rgb(0.06, 0.3, 0.23));
    currentY -= 10;
    
    // Status color
    let statusColor = rgb(0, 0, 0);
    if (decision.final_status === 'GREEN') statusColor = rgb(0.1, 0.7, 0.1);
    if (decision.final_status === 'AMBER') statusColor = rgb(0.9, 0.6, 0.1);
    if (decision.final_status === 'RED') statusColor = rgb(0.9, 0.1, 0.1);

    const confLevel = decision.uncertainty_score < 15 ? 'High' : decision.uncertainty_score < 35 ? 'Medium' : 'Low';

    // 1. Executive Summary
    drawSectionHeader("1. Executive Summary");
    drawText(`• Address: ${input.address}`, timesRomanFont, 12);
    drawText(`• Current EPC: ${input.epc_band_current}`, timesRomanFont, 12);
    drawText(`• Target EPC: ${input.retrofit_target}`, timesRomanFont, 12);
    drawText(`• Achievable EPC: ${decision.achievable_epc_band}`, timesBoldFont, 12);
    drawText(`• Final Status: ${decision.final_status}`, timesBoldFont, 12, statusColor);
    drawText(`• Confidence Level: ${confLevel}`, timesRomanFont, 12);

    // 2. Property Baseline Summary
    drawSectionHeader("2. Property Baseline Summary");
    const baseline = decision.property_baseline || {} as any;
    drawText(`• Archetype classification: ${baseline.archetype || 'Unknown'}`, timesRomanFont, 12);
    drawText(`• Construction age band: ${baseline.age_band || 'Unknown'}`, timesRomanFont, 12);
    drawText(`• Wall type: ${baseline.wall_type || 'Unknown'}`, timesRomanFont, 12);
    drawText(`• Floor area: ${baseline.floor_area || 0} m²`, timesRomanFont, 12);
    drawText(`• Climate region: ${baseline.climate_region || 'Unknown'}`, timesRomanFont, 12);
    drawText(`• Heating system: ${baseline.heating_system || 'Unknown'}`, timesRomanFont, 12);

    // 3. Risk Assessment
    drawSectionHeader("3. Risk Assessment");
    const risk = decision.risk_assessment || {} as any;
    drawText(`Moisture Risk: ${risk.moisture_risk || 'UNKNOWN'}`, timesBoldFont, 12);
    drawText(`  Explain why: ${risk.moisture_reason || 'N/A'}`, timesRomanFont, 12);
    currentY -= 5;
    drawText(`Ventilation Adequacy: ${risk.ventilation_adequacy || 'UNKNOWN'}`, timesBoldFont, 12);
    currentY -= 5;
    drawText(`Structural Uncertainty: ${risk.structural_uncertainty || 'UNKNOWN'}`, timesBoldFont, 12);

    // 4. Deterministic Retrofit Pathway
    drawSectionHeader("4. Deterministic Retrofit Pathway");
    if (decision.sequencing_order && decision.sequencing_order.length > 0) {
      decision.sequencing_order.forEach((measure, idx) => {
        drawText(`  ${idx + 1}. ${measure}`);
      });
    } else {
      drawText("  No measures recommended or pathway blocked.");
    }

    // 5. EPC Uplift Projection
    drawSectionHeader("5. EPC Uplift Projection");
    const proj = decision.epc_projection || {} as any;
    drawText(`• Current: ${proj.current || input.epc_band_current}`, timesRomanFont, 12);
    drawText(`• After Fabric: ${proj.after_fabric || 'N/A'}`, timesRomanFont, 12);
    drawText(`• After Heating: ${proj.after_heating || 'N/A'}`, timesRomanFont, 12);
    drawText(`• After Renewables: ${proj.after_renewables || 'N/A'}`, timesRomanFont, 12);

    // 6. Preconditions (If Any)
    drawSectionHeader("6. Preconditions (If Any)");
    if (decision.structured_preconditions && decision.structured_preconditions.length > 0) {
      decision.structured_preconditions.forEach((cond) => {
        drawText(`Blocked Measure: ${cond.blocked_measure}`, timesBoldFont, 12, rgb(0.8, 0.3, 0.1));
        drawText(`Reason: ${cond.reason}`, timesRomanFont, 12);
        drawText(`Required Action: ${cond.required_action}`, timesRomanFont, 12);
        currentY -= 5;
      });
    } else {
      drawText("  None.");
    }

    // 7. Constraints & Escalation Flags
    drawSectionHeader("7. Constraints & Escalation Flags");
    let hasConstraints = false;
    if (decision.constraints && decision.constraints.length > 0) {
      decision.constraints.forEach(c => drawText(`• ${c}`));
      hasConstraints = true;
    }
    if (decision.escalation_flags && decision.escalation_flags.length > 0) {
      decision.escalation_flags.forEach(f => drawText(`• ${f}`, timesBoldFont, 12, rgb(0.8, 0.2, 0.2)));
      hasConstraints = true;
    }
    if (!hasConstraints) {
      drawText("  None.");
    }

    // 8. Assumptions Log
    drawSectionHeader("8. Assumptions Log");
    if (decision.assumptions_log && decision.assumptions_log.length > 0) {
      decision.assumptions_log.forEach(a => {
        drawText(`• ${a}`, timesRomanFont, 10, rgb(0.3, 0.3, 0.3));
      });
    } else {
      drawText("  None documented.", timesRomanFont, 10);
    }

    // 9. Scope & Limitations
    drawSectionHeader("9. Scope & Limitations");
    drawText("• Screening-level assessment only", timesBoldFont, 10, rgb(0.4, 0.4, 0.4));
    drawText("• Not a SAP calculation", timesBoldFont, 10, rgb(0.4, 0.4, 0.4));
    drawText("• Not design advice", timesBoldFont, 10, rgb(0.4, 0.4, 0.4));
    drawText("• Further survey required before installation", timesBoldFont, 10, rgb(0.4, 0.4, 0.4));

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
