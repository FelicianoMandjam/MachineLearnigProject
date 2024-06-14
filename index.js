const inputImage = document.getElementById("image");
const canvas = document.getElementById("canvas");

// ctx = canvasRenderingContext
const ctx = canvas.getContext("2d");

const img = new Image();

inputImage.addEventListener("change", () => {
  // Selectionne le premier fichier (image) de l'élément input.
  const file = inputImage.files[0];

  if (!file) return; // si aucun fichier n'est sélectionné, sort de la fonction

  // crée une instance de FileReader pour lire le contenu du fichier
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    // mise a jour de la source de l'image (img) avec le résultat de la lecture
    img.src = reader.result;
    // Une fois que notre image est chargée entierement
    img.addEventListener("load", async () => {
      canvas.height = img.height;
      canvas.width = img.width;

      /* 
      drawImage: 
        c'est une méthode de l'objet canvasRenderingContext qui permet de dessiner image sur le canvas. 
        0,0 : 
          ce sont les cordonnées x et y ou l'image va commencer à etre dessiné sur le canvas.  (l'image sera dessinée a partir du coin supérieur gauche du canvas)
      */
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Je charge mon modele de detection d'objet avec await pour attendre que le chargement finisse avant de continuer l'execution du code.
      const model = await cocoSsd.load();

      const predictions = await model.detect(canvas);
      console.log(predictions);

      predictions.forEach((prediction) => {
        // Pour chaque prediction , je commence un nouveau tracé
        ctx.beginPath();

        /* 
        [x,y,width , height]
        */
        ctx.rect(...prediction.bbox);

        // largeur du tracé
        ctx.lineWidth = 2;
        // Couleur du contours
        ctx.strokeStyle = "blue";
        // Couleur texte
        ctx.fillStyle = "red";
        // On trace le contour
        ctx.stroke();

        // On affiche le texte.
        ctx.fillText(
          `
            ${prediction.class}`,
          prediction.bbox[0], // x
          prediction.bbox[1] // y
        );
      });
    });
  });
  reader.readAsDataURL(file);
});
