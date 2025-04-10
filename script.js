function triggerFileInput(type) {
    const input = type === 'logo' ? 
      document.querySelector('.logo-container input') :
      document.getElementById('bannerInput');
    input.click();
  }

  function removeImage(type) {
    if (type === 'logo') {
      document.getElementById('logoPreview').innerHTML = '';
      document.querySelector('.logo-container input').style.display = 'block';
      document.getElementById('logoControls').style.display = 'none';
      localStorage.removeItem('logoImage');
    } else {
      document.getElementById('bannerPreview').innerHTML = '';
      document.getElementById('bannerInput').style.display = 'block';
      document.getElementById('bannerControls').style.display = 'none';
      localStorage.removeItem('bannerImage');
    }
  }

  function previewLogo(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const previewDiv = document.getElementById('logoPreview');
        previewDiv.innerHTML = '';
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'logo preview-image';
        previewDiv.appendChild(img);
        event.target.style.display = 'none';
        document.getElementById('logoControls').style.display = 'flex';
        localStorage.setItem('logoImage', e.target.result);
      }
      reader.readAsDataURL(file);
    }
  }

  function previewBanner(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const previewDiv = document.getElementById('bannerPreview');
        previewDiv.innerHTML = '';
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'banner preview-image';
        previewDiv.appendChild(img);
        event.target.style.display = 'none';
        document.getElementById('bannerControls').style.display = 'flex';
        localStorage.setItem('bannerImage', e.target.result);
      }
      reader.readAsDataURL(file);
    }
  }

  function calculatePrices() {
    const basePrice = document.getElementById('basePrice').value;
    const baseWinePrice = document.getElementById('baseWinePrice').value;
    const markup = 1.3; // 30% markup

    // Round to nearest 10 for display
    const roundToDecimal = (num) => Math.round(num / 10) * 10;

    if (basePrice) {
      const exactPrice = basePrice * markup;
      const finalPrice = roundToDecimal(exactPrice);
      document.getElementById('finalPrice').textContent = `Final Price: ${finalPrice} kr`;
    } else {
      document.getElementById('finalPrice').textContent = '';
    }

    if (baseWinePrice) {
      // Calculate exact prices first
      const exactBasePrice = basePrice ? basePrice * markup : 0;
      const exactWinePrice = baseWinePrice * markup;
      
      // Then round for display
      const finalBasePrice = basePrice ? roundToDecimal(exactBasePrice) : 0;
      const finalWinePrice = roundToDecimal(exactWinePrice);
      const totalWithWine = finalBasePrice + finalWinePrice;
      
      let priceBreakdown = '';
      if (basePrice) {
        priceBreakdown += `Food: ${basePrice} kr + 30% = ${finalBasePrice} kr\n`;
      }
      priceBreakdown += `Wine Package: ${baseWinePrice} kr + 30% = ${finalWinePrice} kr\n`;
      priceBreakdown += `Total with Wine Package: ${totalWithWine} kr`;
      
      document.getElementById('finalWinePrice').innerHTML = priceBreakdown.replace(/\n/g, '<br>');
    } else {
      document.getElementById('finalWinePrice').textContent = '';
    }
  }

  window.onload = () => {
    // Restore saved form data from localStorage
    const restaurantName = localStorage.getItem('restaurantName') || '';
    const basePrice = localStorage.getItem('basePrice') || '';
    const baseWinePrice = localStorage.getItem('baseWinePrice') || '';
    const starter = localStorage.getItem('starter') || '';
    const main1 = localStorage.getItem('main1') || '';
    const main2 = localStorage.getItem('main2') || '';
    const dessert = localStorage.getItem('dessert') || '';
    const vegetarian = localStorage.getItem('vegetarian') || '';

    // Restore saved images from localStorage
    const savedLogo = localStorage.getItem('logoImage');
    const savedBanner = localStorage.getItem('bannerImage');

    if (savedLogo) {
      const previewDiv = document.getElementById('logoPreview');
      const img = document.createElement('img');
      img.src = savedLogo;
      img.className = 'logo preview-image';
      previewDiv.appendChild(img);
      document.querySelector('.logo-container input').style.display = 'none';
      document.getElementById('logoControls').style.display = 'flex';
    }

    if (savedBanner) {
      const previewDiv = document.getElementById('bannerPreview');
      const img = document.createElement('img');
      img.src = savedBanner;
      img.className = 'banner preview-image';
      previewDiv.appendChild(img);
      document.getElementById('bannerInput').style.display = 'none';
      document.getElementById('bannerControls').style.display = 'flex';
    }

    // Set the form values
    document.getElementById('restaurantName').value = restaurantName;
    document.getElementById('basePrice').value = basePrice;
    document.getElementById('baseWinePrice').value = baseWinePrice;
    document.querySelector('textarea[name="starter"]').value = starter;
    document.querySelector('textarea[name="main1"]').value = main1;
    document.querySelector('textarea[name="main2"]').value = main2;
    document.querySelector('textarea[name="dessert"]').value = dessert;
    document.querySelector('textarea[name="vegetarian"]').value = vegetarian;

    // Recalculate prices if necessary
    if (basePrice || baseWinePrice) {
      calculatePrices();
    }

    // Add event listeners to save form data
    document.getElementById('restaurantName').addEventListener('input', (e) => {
      localStorage.setItem('restaurantName', e.target.value);
    });

    document.getElementById('basePrice').addEventListener('input', (e) => {
      localStorage.setItem('basePrice', e.target.value);
    });

    document.getElementById('baseWinePrice').addEventListener('input', (e) => {
      localStorage.setItem('baseWinePrice', e.target.value);
    });

    document.querySelector('textarea[name="starter"]').addEventListener('input', (e) => {
      localStorage.setItem('starter', e.target.value);
    });

    document.querySelector('textarea[name="main1"]').addEventListener('input', (e) => {
      localStorage.setItem('main1', e.target.value);
    });

    document.querySelector('textarea[name="main2"]').addEventListener('input', (e) => {
      localStorage.setItem('main2', e.target.value);
    });

    document.querySelector('textarea[name="dessert"]').addEventListener('input', (e) => {
      localStorage.setItem('dessert', e.target.value);
    });

    document.querySelector('textarea[name="vegetarian"]').addEventListener('input', (e) => {
      localStorage.setItem('vegetarian', e.target.value);
    });

    document.getElementById("generatePDF").addEventListener("click", async () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Initialize basic variables
      const lineHeight = 8;
      let currentY = 0;

      const form = document.getElementById('menuForm');
      const restaurantName = document.getElementById('restaurantName').value || 'Restaurant Menu';
      const basePrice = document.getElementById('basePrice').value;
      const baseWinePrice = document.getElementById('baseWinePrice').value;
      const markup = 1.3;
      
      // Use the same rounding function for PDF generation
      const roundToDecimal = (num) => Math.round(num / 10) * 10;
      
      // Calculate exact prices first, then round for display
      const exactBasePrice = basePrice ? basePrice * markup : 0;
      const exactWinePrice = baseWinePrice ? baseWinePrice * markup : 0;
      
      const finalPrice = basePrice ? roundToDecimal(exactBasePrice) : '';
      const finalWinePrice = baseWinePrice ? roundToDecimal(exactWinePrice) : '';
      const totalWithWine = basePrice && baseWinePrice ? 
        roundToDecimal(exactBasePrice) + roundToDecimal(exactWinePrice) : '';

      const starter = form.starter.value;
      const main1 = form.main1.value;
      const main2 = form.main2.value;
      const dessert = form.dessert.value;
      const vegetarian = form.vegetarian.value;

      // Load images if available
      const restaurantLogoEl = document.querySelector("#logoPreview img");
      const restaurantLogo = restaurantLogoEl ? restaurantLogoEl.src : null;
      
      const bannerEl = document.querySelector("#bannerPreview img");
      const banner = bannerEl ? bannerEl.src : null;

      const loadImage = (src) => new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

      const addImageToPDF = async (src, x, y, w, h) => {
        if (!src) return;
        const img = await loadImage(src);
        if (!img) return;
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        doc.addImage(dataUrl, "PNG", x, y, w, h);
      };

      // Add banner if available
      if (banner) {
        await addImageToPDF(banner, 0, 0, 210, 60); // A4 width is 210mm
      }

      // Add logo if available (always on top)
      if (restaurantLogo) {
        // Calculate logo dimensions to maintain aspect ratio
        const logoImg = await loadImage(restaurantLogo);
        if (logoImg) {
          const aspectRatio = logoImg.width / logoImg.height;
          const logoHeight = 25; // Fixed height in mm
          const logoWidth = logoHeight * aspectRatio;
          await addImageToPDF(restaurantLogo, 210 - logoWidth - 10, 10, logoWidth, logoHeight);
        }
      }

      // Add restaurant name with tighter spacing
      doc.setFont("Georgia", "normal");
      doc.setFontSize(24);
      doc.setTextColor(212, 196, 167); // Set color to match aesthetic
      doc.text(restaurantName, 105, banner ? 70 : 20, { align: "center" });
      currentY = banner ? 80 : 30;

      // Add menu title closer to restaurant name
      doc.setFont("Georgia", "normal");
      doc.setFontSize(20);
      doc.text("3-COURSE MENU", 105, currentY, { align: "center" });
      currentY += lineHeight;

      // Calculate text width for price box
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Reset text color to black for prices
      const textWidth = Math.max(
        doc.getTextWidth(`Menu Price Excl. Wine Package: ${finalPrice} kr`),
        doc.getTextWidth(`Menu Price Incl. Wine Package: ${totalWithWine} kr`)
      );

      // Add price box with tighter internal spacing
      const boxWidth = textWidth + 20;
      const boxHeight = finalPrice && finalWinePrice ? 20 : 12;
      const boxX = (210 - boxWidth) / 2;
      
      // Set colors for the price box
      doc.setDrawColor(212, 196, 167);
      doc.setFillColor(250, 246, 240);
      doc.roundedRect(boxX, currentY, boxWidth, boxHeight, 2, 2, 'FD');
      
      // --- Draw Price Text with selective bolding ---
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Ensure text is black

      const drawPriceLine = (label, priceValue, yPos) => {
        if (!priceValue && priceValue !== 0) return; // Check for valid price

        const priceString = `${priceValue} kr`; // Combine price and currency
        const fullTextWidth = doc.getTextWidth(label) + doc.getTextWidth(priceString); // Width based on normal label + bold price
        let startX = 105 - (fullTextWidth / 2); // Starting X for center alignment

        // Draw label (normal)
        doc.setFont("Georgia", "normal");
        doc.text(label, startX, yPos);

        // Calculate X position for the bold price part
        const priceX = startX + doc.getTextWidth(label);

        // Draw price + kr (bold)
        doc.setFont("Georgia", "bold");
        doc.text(priceString, priceX, yPos);
      };

      const label1 = "Menu Price Excl. Wine Package: ";
      const label2 = "Menu Price Incl. Wine Package: ";
      const yOffset1 = 7; // Vertical offset for first line from box top
      const yOffset2 = 16; // Vertical offset for second line
      const yOffsetSingle = 11.5; // Vertical offset for single line (centered)

      if (finalPrice || finalPrice === 0) {
        if (totalWithWine || totalWithWine === 0) {
          // Both prices exist: Draw two lines
          drawPriceLine(label1, finalPrice, currentY + yOffset1);
          drawPriceLine(label2, totalWithWine, currentY + yOffset2);
        } else {
          // Only Excl. price: Draw single centered line
          drawPriceLine(label1, finalPrice, currentY + yOffsetSingle);
        }
      } else if (totalWithWine || totalWithWine === 0) {
        // Only Incl. price: Draw single centered line
        drawPriceLine(label2, totalWithWine, currentY + yOffsetSingle);
      }

      // --- End Price Text Drawing Logic ---

      currentY += boxHeight + lineHeight;

      // Reset font style just in case something else relies on it being normal
      doc.setFont("Georgia", "normal"); 

      // Add section headers and content with consistent font
      const addSection = (title, content1, content2 = null) => {
        // Add section title in normal font
        doc.setFont("Georgia", "normal");
        doc.setFontSize(14);
        doc.text(title, 105, currentY, { align: "center" });
        currentY += lineHeight * 0.8;
        
        doc.setFont("Georgia", "italic");
        doc.setFontSize(12);
        
        // Special handling for main course section
        if (title === "MAIN COURSE" && content1 && content2) {
          // Split content into lines for potential multi-line display
          const lines1 = doc.splitTextToSize(content1, 170); // Max width
          const lines2 = doc.splitTextToSize(content2, 170); // Max width
          
          // First option
          lines1.forEach(line => {
            doc.text(line, 105, currentY, { align: "center" });
            currentY += lineHeight * 0.8; // Tighter spacing
          });
          currentY += lineHeight * 0.7; // Space before 'or'
          
          // Add "or" with decorative lines
          const lineWidth = 30;
          doc.setDrawColor(212, 196, 167);
          doc.line(105 - lineWidth - 15, currentY - lineHeight/4, 105 - 15, currentY - lineHeight/4);
          doc.line(105 + 15, currentY - lineHeight/4, 105 + lineWidth + 15, currentY - lineHeight/4);
          
          doc.setFont("Georgia", "italic");
          doc.text("or", 105, currentY, { align: "center" });
          currentY += lineHeight; // Space after 'or'
          
          // Second option
          lines2.forEach(line => {
            doc.text(line, 105, currentY, { align: "center" });
            currentY += lineHeight * 0.8; // Tighter spacing
          });

        } else if (content1) { // Handle single content sections (Starter, Dessert, Veg)
          // Regular section content
          const contentLines = doc.splitTextToSize(content1, 170); // Max width
          contentLines.forEach((line, i) => {
            doc.text(line, 105, currentY, { align: "center" });
            currentY += lineHeight * 0.8; // Tighter spacing for related content
          });
        }
        currentY += lineHeight * 1.5;
      };

      // Add sections with adjusted spacing
      addSection("STARTER", starter);
      // Pass main1 and main2 separately
      addSection("MAIN COURSE", main1, main2); 
      addSection("DESSERT", dessert);
      addSection("VEGETARIAN ALTERNATIVE", vegetarian);

      // Add border around the entire content
      doc.setDrawColor(212, 196, 167);
      doc.rect(10, 10, 190, 277); // A4 size with margins

      // Add footer texts with adjusted size and position
      const footerFontSize = 9; // Reduced font size
      const footerLineHeight = 4; // Adjusted line height for smaller font
      doc.setFont("Georgia", "italic");
      doc.setFontSize(footerFontSize);
      
      // First footer text (Menu description)
      const footerText1 = "We have put together a lovely 3-course menu where you choose the main course yourself. In order to achieve the best experience, we recommend that everyone at the table orders the same menu (except in the case of possible food allergies or a vegetarian diet. Notify us if allergies in good time).";
      const footerLines1 = doc.splitTextToSize(footerText1, 170); // Keep width constraint
      
      // Second footer text (VAT/Price info)
      const footerText2 = "*Prices are inclusive of VAT (food 12%, alcohol 25%). We reserve ourselves for minor price changes.";
      const footerLines2 = doc.splitTextToSize(footerText2, 170); // Keep width constraint
      
      // Position footers from bottom, closer to the edge
      const bottomMargin = 15; // Closer to the bottom edge (10mm from page bottom)
      const footerY2 = 297 - bottomMargin - (footerLines2.length * footerLineHeight);
      const footerY1 = footerY2 - (footerLines1.length * footerLineHeight) - 2; // Position above Y2 with small gap
      
      doc.text(footerLines1, 105, footerY1, { align: "center" });
      doc.text(footerLines2, 105, footerY2, { align: "center" });

      // Add Generated by Fjordesk under the border
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 180);
      const poweredByText = "Generated by Fjordesk";
      const borderBottomY = 10 + 277;
      const poweredByY = borderBottomY + 4;
      
      // Render text centered below border (icon logic removed)
      doc.text(poweredByText, 105, poweredByY, { align: "center" }); 

      // Prompt for filename
      const defaultName = "Menu_RestaurantName";
      const fileName = prompt("Replace RestaurantName with the Actual Name to save the PDF (without extension):", defaultName) || defaultName;

      doc.save(`${fileName}.pdf`);
    });
  };