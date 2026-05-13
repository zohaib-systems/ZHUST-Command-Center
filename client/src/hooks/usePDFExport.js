import { useRef } from 'react';
import { jsPDF } from 'jspdf';
import { useApp } from '../hooks/useApp';

export const usePDFExport = () => {
  const { data, generateSnapshot } = useApp();

  const exportToPDF = async () => {
    try {
      const snapshot = await generateSnapshot();
      if (!snapshot) throw new Error('Failed to generate snapshot');

      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 10;

      // Title
      doc.setFontSize(20);
      doc.text('🏛️ ZHUST Command Center', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Subtitle
      doc.setFontSize(12);
      doc.text('Weekly Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      // Generated date
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date(snapshot.generatedAt).toLocaleDateString()}`, 10, yPosition);
      yPosition += 8;

      // Weekly Goals
      doc.setFontSize(14);
      doc.setTextColor(30, 58, 138);
      doc.text('📋 Weekly Goals', 10, yPosition);
      yPosition += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);

      if (snapshot.data.weekly_goals.length === 0) {
        doc.text('No goals defined', 15, yPosition);
        yPosition += 6;
      } else {
        snapshot.data.weekly_goals.forEach((goal, idx) => {
          const text = `${idx + 1}. ${goal}`;
          const lines = doc.splitTextToSize(text, pageWidth - 30);
          doc.text(lines, 15, yPosition);
          yPosition += 6;
        });
      }

      yPosition += 5;

      // Sprint Board
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 10;
      }

      doc.setFontSize(14);
      doc.setTextColor(30, 58, 138);
      doc.text('🚀 Sprint Board', 10, yPosition);
      yPosition += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);

      ['tech', 'academic', 'administrative'].forEach(category => {
        const tasks = snapshot.data.sprint_board[category] || [];
        doc.setFont(undefined, 'bold');
        doc.text(`${category.toUpperCase()}:`, 15, yPosition);
        yPosition += 5;
        doc.setFont(undefined, 'normal');

        if (tasks.length === 0) {
          doc.text('No tasks', 20, yPosition);
          yPosition += 5;
        } else {
          tasks.forEach((task, idx) => {
            const text = `• ${task}`;
            const lines = doc.splitTextToSize(text, pageWidth - 35);
            doc.text(lines, 20, yPosition);
            yPosition += 5;
          });
        }

        yPosition += 3;
      });

      // Save
      doc.save(`ZHUST-Report-${new Date().toISOString().split('T')[0]}.pdf`);
      return true;
    } catch (error) {
      console.error('PDF Export Error:', error);
      return false;
    }
  };

  return { exportToPDF };
};
