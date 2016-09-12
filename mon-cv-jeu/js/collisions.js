// Fonction de vérification si deux objets (pris comme cercle) sont entrés en collision
// elle prend en argument deux objets
function hitverifCercle(c1, c2){
  //Calcul de la composante vx et vy qui définissent le vecteur entre les deux centres des 2 objets
  var vx = c1.centerX() - c2.centerX();
  var vy = c1.centerY() - c2.centerY();
  // Calcul de la longueur du vecteur entre les deux centres des objets
  var magnitude = Math.sqrt(vx * vx + vy * vy);
  //La somme des deux rayons des cercles
  var totalRadii = c1.halfWidth() + c2.halfWidth();

  // la variable hit prend la valeur true si la distance entre les 2 centres est inférieur à la somme des rayons
  var hit = magnitude < totalRadii;
  return hit;
};

// Fonction qui vérifie s'il y a une collision entre deux objets r1 et r2 pris en argument
// c'est une collision entre deux rectangles
// et indique de quel côté se fait la collision : gauche, droite, par le haut ou le bas
function blockRectangle(r1, r2, bounce){

  if(typeof bounce === "undefined"){bounce = false;}

  //variable qui indique de quel côté se fait la collision
  var collisionSide = "";

  //Calcul des deux composantes du vecteur entre les deux centres des objets
  var vx = r1.centerX() - r2.centerX();
  var vy = r1.centerY() - r2.centerY();

  // calcul de la somme des demis-largeurs et demis-hauteurs des deux rectangles objets
  var combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
  var combinedHalfHeights = r1.halfHeight() + r2.halfHeight();

  // Comparaison entre la valeur absolue de la composante vx et la somme des demis largeurs
  if(Math.abs(vx) < combinedHalfWidths){
    // Comparaison entre la valeur absolue de la composante vy et la somme des demis hauteurs
    if(Math.abs(vy) < combinedHalfHeights){
      // calcul du chevauchement sur l'axe des x et l'axe des y
      var overlapX = combinedHalfWidths - Math.abs(vx);
      var overlapY = combinedHalfHeights - Math.abs(vy);
      // si le chauvement sur l'axe des X est supérieur à celui sur l'axe des Y :
      if(overlapX >=  overlapY){
        // la collision se situe sur l'axe des Y
        //si vy > 0, la collision se fait par le haut
        if(vy > 0){
          collisionSide = "top";
          // l'objet est déplacé hors de la zone de chevauchement sur l'axe des Y
          r1.y = r1.y + overlapY;
        } else {
          collisionSide = "bottom";
          // l'objet est déplacé hors de la zone de chevauchement sur l'axe des Y
          r1.y = r1.y - overlapY;
        };
		    // on lui fait prendre la direction opposée sur l'axe des Y
		    if(bounce){
          r1.vy *= -1;
        };
      } else {
        // la collision se situe sur l'axe des X
        //On vérifie de quel côté
        if(vx > 0){
          collisionSide = "left";
          //l'objet est déplacé hors de la zone de chevauchement sur l'axe des X
          r1.x = r1.x + overlapX;
        } else {
          collisionSide = "right";
          //l'objet est déplacé hors de la zone de chevauchement sur l'axe des X
          r1.x = r1.x - overlapX;
        };
        // on lui fait prendre la direction opposée sur l'axe des X
        if(bounce){
          r1.vx *= -1;
        };
      };
    } else {
      collisionSide = "none";
    };
  } else {
    collisionSide = "none";
  };
  return collisionSide;
};
