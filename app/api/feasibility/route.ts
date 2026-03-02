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
      epc_band_current: EPCBand.E, 
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
    };

    // --- ENGINE EXECUTION ---
    // This calls EPC -> Archetype -> Climate -> Measures -> Moisture -> Sequencing -> EPC Uplift -> Decision
    const decision = RetrofitFeasibilityEngine.evaluateProperty(input);

    // --- PDF GENERATION ---
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size
    const { width, height } = page.getSize();
    
    let currentY = height - 50;
    const paddingLeft = 50;

    const drawText = (text: string, font: any = timesRomanFont, size: number = 12, color: any = rgb(0,0,0)) => {
      page.drawText(text, { x: paddingLeft, y: currentY, size, font, color });
      currentY -= size + 8;
    };

    // Header
    drawText("Retrofit-First Feasibility Report", timesBoldFont, 24, rgb(0.06, 0.3, 0.23)); // #0F4C3A
    currentY -= 10;
    drawText(`Address: ${input.address}`, timesBoldFont, 14);
    drawText(`Target: ${input.retrofit_target}`, timesRomanFont, 12);
    currentY -= 20;

    // Decision Section
    drawText("1. Overall Deterministic Decision", timesBoldFont, 16);
    
    // Status color
    let statusColor = rgb(0, 0, 0);
    if (decision.final_status === 'GREEN') statusColor = rgb(0.1, 0.7, 0.1);
    if (decision.final_status === 'AMBER') statusColor = rgb(0.9, 0.6, 0.1);
    if (decision.final_status === 'RED') statusColor = rgb(0.9, 0.1, 0.1);

    drawText(`Final Status: ${decision.final_status}`, timesBoldFont, 14, statusColor);
    drawText(`Achievable EPC Band: ${decision.achievable_epc_band}`, timesRomanFont, 12);
    drawText(`Uncertainty Score: ${decision.uncertainty_score}`, timesRomanFont, 12);
    currentY -= 10;

    // Pathway
    drawText("2. Sequencing & Recommended Pathway", timesBoldFont, 16);
    if (decision.sequencing_order && decision.sequencing_order.length > 0) {
      decision.sequencing_order.forEach((measure, idx) => {
        drawText(`  ${idx + 1}. ${measure}`);
      });
    } else {
      drawText("  No measures recommended or pathway blocked.");
    }
    currentY -= 10;

    // Preconditions
    drawText("3. Required Preconditions", timesBoldFont, 16);
    if (decision.required_preconditions && decision.required_preconditions.length > 0) {
      decision.required_preconditions.forEach((cond) => {
        drawText(`  - ${cond}`, timesRomanFont, 12, rgb(0.8, 0.3, 0.1));
      });
    } else {
      drawText("  None.");
    }
    currentY -= 10;

    // Constraints & Flags
    drawText("4. Constraints & Escalation Flags", timesBoldFont, 16);
    if (decision.constraints && decision.constraints.length > 0) {
      decision.constraints.forEach(c => drawText(`  Constraint: ${c}`));
    }
    if (decision.escalation_flags && decision.escalation_flags.length > 0) {
      decision.escalation_flags.forEach(f => drawText(`  Flag: ${f}`, timesBoldFont, 12, rgb(0.8, 0.2, 0.2)));
    }
    if ((!decision.constraints || decision.constraints.length === 0) && (!decision.escalation_flags || decision.escalation_flags.length === 0)) {
      drawText("  None.");
    }
    currentY -= 10;

    // Assumptions Log
    drawText("5. Assumptions Log", timesBoldFont, 16);
    if (decision.assumptions_log && decision.assumptions_log.length > 0) {
      decision.assumptions_log.forEach(a => drawText(`  - ${a}`, timesRomanFont, 10, rgb(0.4, 0.4, 0.4)));
    } else {
      drawText("  None documented.");
    }

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
