import { jsPDF } from 'jspdf';

export const downloadRoadmapPDF = (domain, explanation, roadmap, resources, videoTitle) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  let currentY = 20;

  // Draw Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(29, 29, 31); // #1d1d1f (Apple black)
  doc.text(`Dream Me Career Roadmap`, 20, currentY);
  currentY += 10;

  doc.setFontSize(16);
  doc.setTextColor(217, 70, 239); // #d946ef (Rose)
  doc.text(domain.name, 20, currentY);
  currentY += 7;

  // Category and Match details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110, 110, 115);
  doc.text(`Category: ${domain.category} | Confidence Level: ${domain.confidence || "Worth exploring"}`, 20, currentY);
  currentY += 5;

  // Divider Line
  doc.setDrawColor(210, 210, 215);
  doc.line(20, currentY, 190, currentY);
  currentY += 10;

  // 1. Psychological Alignment
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(29, 29, 31);
  doc.text("Psychological Alignment & Transparency", 20, currentY);
  currentY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 85);
  const alignmentText = doc.splitTextToSize(explanation || "Your behavioral profile aligns closely with this discipline.", 170);
  doc.text(alignmentText, 20, currentY);
  currentY += (alignmentText.length * 5) + 10;

  // 2. Learning Roadmap Timeline
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(29, 29, 31);
  doc.text("Structured Learning Timeline", 20, currentY);
  currentY += 8;

  (roadmap || []).forEach((step, idx) => {
    // Check if we need a new page
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0, 113, 227);
    doc.text(step.phase, 20, currentY);
    currentY += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(60, 60, 65);
    
    (step.milestones || []).forEach(milestone => {
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
      const bulletText = doc.splitTextToSize(`• ${milestone}`, 160);
      doc.text(bulletText, 25, currentY);
      currentY += (bulletText.length * 5);
    });
    currentY += 6;
  });

  // 3. Resources Section
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  } else {
    currentY += 4;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(29, 29, 31);
  doc.text("Launchpad Learning Resources", 20, currentY);
  currentY += 8;

  (resources || []).forEach(res => {
    if (currentY > 265) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(29, 29, 31);
    doc.text(res.name, 20, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 85);
    const descText = doc.splitTextToSize(res.description || "", 170);
    doc.text(descText, 20, currentY);
    currentY += (descText.length * 4.5);

    if (res.url) {
      doc.setTextColor(0, 113, 227);
      doc.text(`Link: ${res.url}`, 20, currentY);
      currentY += 5;
    } else {
      doc.setTextColor(110, 110, 115);
      doc.text(`* Suggested dynamic learning resource (Verify names/providers)`, 20, currentY);
      currentY += 5;
    }
    currentY += 4;
  });

  // 4. Video Reference
  if (videoTitle) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    } else {
      currentY += 4;
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(29, 29, 31);
    doc.text("Linked Video Masterclass", 20, currentY);
    currentY += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(80, 80, 85);
    const vTitleText = doc.splitTextToSize(`Title: ${videoTitle}`, 160);
    doc.text(vTitleText, 20, currentY);
    currentY += (vTitleText.length * 5) + 2;
    doc.text("Watch embed player directly inside the Dream Me dashboard portal.", 20, currentY);
  }

  // Draw Page numbers in Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount} | Dream Me - Find your dream here!!`, 20, 287);
  }

  doc.save(`DreamMe_${domain.name.replace(/[^a-zA-Z0-9]/g, '_')}_Roadmap.pdf`);
};
