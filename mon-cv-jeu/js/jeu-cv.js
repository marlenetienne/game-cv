// création d'objet sprite
var spriteObject = {
  //la position du sprite sur l'image source
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 72,
  sourceHeight: 98,

  //position du sprite au sein du canvas
  width: 72,
  height: 98,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  visible: true,

  //les propriétés physiques
  accelerationX: 0,
  accelerationY: 0,
  speedLimit: 5,
  friction: 0.96,
  bounce: -0.7,
  gravity: 0.3,

  //propriété du jeu
  isOnGround: undefined,
  jumpForce: -10,

  //Getters de l'ojet sprite
  centerX: function(){return this.x + (this.width/2);},
  centerY: function(){return this.y + (this.height/2);},
  halfWidth: function(){return this.width/2;},
  halfHeight: function(){return this.height/2;}
};

//--- Programme du jeu

//Le canvas
var canvas = document.querySelector("canvas");
var drawingSurface = canvas.getContext("2d");

//Les tableaux
var sprites = [];
var blocks = [];
var phytos = [];
var assetsToLoad = [];
var assetsLoaded = 0;

//Le background
var background = Object.create(spriteObject);
background.sourceY = 157;
background.sourceWidth = 4000;
background.sourceHeight = 600;
background.width = 4000;
background.height = 600;
background.x = 0;
background.y = 0;
sprites.push(background);

//Le personnage
var bloob = Object.create(spriteObject);
bloob.height = 94;
bloob.x = 100;
bloob.y = canvas.height - bloob.height;
sprites.push(bloob);

//Le phytoplancton
var phyto1 = Object.create(spriteObject);
phyto1.sourceX = 220;
phyto1.sourceY = 100;
phyto1.sourceWidth = 56;
phyto1.sourceHeight = 57;
phyto1.width = 56;
phyto1.height = 57;
phyto1.x = 65;
phyto1.y = 170;
phyto1.visible=true;
sprites.push(phyto1);
phytos.push(phyto1);

var phyto2 = Object.create(spriteObject);
phyto2.sourceX = 0;
phyto2.sourceY = 100;
phyto2.sourceWidth = 56;
phyto2.sourceHeight = 55;
phyto2.width = 56;
phyto2.height = 55;
phyto2.x = 135;
phyto2.y = 70;
phyto2.visible=true;
sprites.push(phyto2);
phytos.push(phyto2);

var phyto3 = Object.create(spriteObject);
phyto3.sourceX = 56;
phyto3.sourceY = 100;
phyto3.sourceWidth = 53;
phyto3.sourceHeight = 55;
phyto3.width = 53;
phyto3.height = 55;
phyto3.x = 335;
phyto3.y = 130;
phyto3.visible=true;
sprites.push(phyto3);
phytos.push(phyto3);

var phyto4 = Object.create(spriteObject);
phyto4.sourceX = 164;
phyto4.sourceY = 100;
phyto4.sourceWidth = 56;
phyto4.sourceHeight = 55;
phyto4.width = 56;
phyto4.height = 55;
phyto4.x = 535;
phyto4.y = 60;
phyto4.visible=true;
sprites.push(phyto4);
phytos.push(phyto4);

var phyto5 = Object.create(spriteObject);
phyto5.sourceX = 109;
phyto5.sourceY = 100;
phyto5.sourceWidth = 55;
phyto5.sourceHeight = 55;
phyto5.width = 55;
phyto5.height = 55;
phyto5.x = 700;
phyto5.y = 100;
phyto5.visible=true;
sprites.push(phyto5);
phytos.push(phyto5);

//Les plateformes
var block1 = Object.create(spriteObject);
block1.sourceX = 104;
block1.sourceY = 12;
block1.sourceWidth = 92;
block1.sourceHeight = 14;
block1.width=92;
block1.height=14;
block1.x = 50;
block1.y = 450;
sprites.push(block1);
blocks.push(block1);

var block2 = Object.create(spriteObject);
block2.sourceX = 102;
block2.sourceY = 12;
block2.sourceWidth = 92;
block2.sourceHeight = 14;
block2.width = 92;
block2.height = 14;
block2.x = 180;
block2.y = 300;
sprites.push(block2);
blocks.push(block2);

var block3 = Object.create(spriteObject);
block3.sourceX = 104;
block3.sourceY = 12;
block3.sourceWidth = 92;
block3.sourceHeight = 14;
block3.width=92;
block3.height=14;
block3.x = 400;
block3.y = 450;
sprites.push(block3);
blocks.push(block3);

var block4 = Object.create(spriteObject);
block4.sourceX = 104;
block4.sourceY = 12;
block4.sourceWidth = 92;
block4.sourceHeight = 14;
block4.width=92;
block4.height=14;
block4.x = 600;
block4.y = 380;
sprites.push(block4);
blocks.push(block4);

//Le chargement du sprite
var image = new Image();
image.addEventListener("load", loadHandler, false);
image.src = "img/sprite7.png";
assetsToLoad.push(image);

//L'état du jeu
var LOADING = 0;
var PLAYING = 1;
var gameState = LOADING;

//Les codes clavier
var RIGHT = 39;
var LEFT = 37;
var SPACE = 32;

//type de mouvement
var moveRight = false;
var moveLeft = false;
var jump = false;

// variables pour l'affichage des éléments du CV
var phytosHit=0;
var indexImgNext=0;

// création d'élément image pour chaque collision
function createImg(){
  var img = document.createElement('img');
  img.src = 'logos/img'+indexImgNext+'.png';
  img.style.display = 'block';
  img.style.paddingLeft ='80px';
  var element = document.getElementById('glasspane');
  element.appendChild(img);
  indexImgNext+=1;
};

// insérer un élément de DOM après un autre
function insertAfter(newElement, afterElement) {
    var parent = afterElement.parentNode;
    if (parent.lastChild === afterElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, afterElement.nextSibling);
    }
};

// A la fin du jeu, création d'un paragraphe et d'un lien vers le CV entier
function endGame(){
  // créer le paragraphe
  var p2 = document.createElement('p');
  p2.textContent = "Découvrez la suite :";
  var element = document.getElementsByTagName('img');
  insertAfter(p2, element[4]);
  // créer le lien vers le CV dans le paragraphe
  var button = document.createElement('button');
  // insérer le lien dans le paragraphe
  insertAfter(button,p2);
  // créer un lien dans le bouton
  var a = document.createElement('a');
  var texteA = document.createTextNode('Par ici');
  a.appendChild(texteA);
  a.href="fichier/CV.pdf";
  a.title="cliquez ici";
  button.appendChild(a);
};

//Les listeners d'événements

window.addEventListener("keydown", function(event){
  switch(event.keyCode)
  {
	  case LEFT:
	    moveLeft = true;
	    break;

	  case RIGHT:
	    moveRight = true;
	    break;

	  case SPACE:
  	  jump = true;
  	  break;
  }
}, false);

window.addEventListener("keyup", function(event)
{
  switch(event.keyCode)
  {
	  case LEFT:
	    moveLeft = false;
	    break;

	  case RIGHT:
	    moveRight = false;
	    break;

	  case SPACE:
  	  jump = false;
  	  break;
  }
}, false);

// fonction vérification du chargement des éléments
function loadHandler(){
  assetsLoaded++;
  if(assetsLoaded === assetsToLoad.length){
    gameState = PLAYING;
  }
};

// Fixe les variables des propriétés déclarées au début du programme selon interaction de l'utilsateur avec le clavier
function playGame(){
  //Mouvement de gauche : mouvement contraire (accélération négative)
  if(moveLeft && !moveRight){
    bloob.accelerationX = -0.2;
    bloob.friction = 1;
  }
  //Mouvement de droite
  if(moveRight && !moveLeft){
    bloob.accelerationX = 0.2;
    bloob.friction = 1;
  }
  //si le personnage saute et est sur le sol (et non sur une plateforme)
  if(jump && bloob.isOnGround){
    bloob.vy += bloob.jumpForce;
    bloob.isOnGround = false;
    bloob.friction = 1;
  }

  //Fixe l'accélération à zéro si les touches flèches ne sont pas pressées
  if(!moveLeft && !moveRight){
    bloob.accelerationX = 0;
    bloob.friction = 0.96;
    bloob.gravity = 0.3;
  };

  //Application de l'accélération au mouvement
  bloob.vx += bloob.accelerationX;
  bloob.vy += bloob.accelerationY;

  //Application de la force de la friction si le personnage est au sol
  if(bloob.isOnGround){
    bloob.vx *= bloob.friction;
  };

  //Application de la gravité au mouvement verticale du personnage
  bloob.vy += bloob.gravity;

  // La vitesse est limitée dès qu'elle dépasse la limite fixée au début du programme par la variable speedLimit
  if (bloob.vx > bloob.speedLimit){
    bloob.vx = bloob.speedLimit;
  };
  if (bloob.vx < -bloob.speedLimit){
    bloob.vx = -bloob.speedLimit;
  };
  // La vitesse n'est pas limitée quand le personnage a un mouvement verticale afin de ne pas réduire l'effet lié au saut
  if (bloob.vy > bloob.speedLimit*2){
    bloob.vy = bloob.speedLimit * 2;
  };

  //Fait bouger le personnage
  bloob.x += bloob.vx;
  bloob.y += bloob.vy;

  //Vérifier s'il y a une collision avec l'une des plateformes créées
  for(var i = 0; i < blocks.length; i++){
      var collisionSide = blockRectangle(bloob, blocks[i],false);
      // selon le côté où a lieu la collision, le comportement est différent
      if(collisionSide === "bottom" && bloob.vy >= 0){
        // le personnage est sur une plateforme assimilée au sol
        // la force négative de la gravité doit être appliquée
        bloob.isOnGround = true;
        bloob.vy = -bloob.gravity;
      }else if(collisionSide === "top" && bloob.vy <= 0){
        bloob.vy = 0;
      }else if(collisionSide === "right" && bloob.vx >= 0){
        bloob.vx = 0;
      }else if(collisionSide === "left" && bloob.vx <= 0){
        bloob.vx = 0;
      };
      if(collisionSide !== "bottom" && bloob.vy > 0){
        bloob.isOnGround = false;
      };
  };

  //Les collisions avec le phytoplancton
  for(var i = 0; i < phytos.length; i++){
    var phyto = phytos[i];
    //S'il y a une collision, effacer le phytoplancton du canvas et faire apparaître un logo
    // sur le côté de la page
    if(hitverifCercle(phyto, bloob) && phyto.visible){
      phyto.visible = false;
      phytos.slice(i,1);
      createImg();
      phytosHit++;
      if(phytosHit === phytos.length){
        endGame();
      };
    };
  };

  //Les collisions avec les côtés du canvas
  //Coté gauche
  if(bloob.x < 0){
    // diminution du mouvement horizontale (de la vitesse) grace à la constante bounce
    bloob.vx *= bloob.bounce;
    bloob.x = 0;
  };
  //Top
  if(bloob.y < 0){
    bloob.vy *= bloob.bounce;
    bloob.y = 0;
  };
  //Coté droit
  if(bloob.x + bloob.width > canvas.width){
    bloob.vx *= bloob.bounce;
    bloob.x = canvas.width - bloob.width;
  };
  //Bas : fixe la variable isOnGround à true / applique la force de gravité
  if(bloob.y + bloob.height > canvas.height){
    bloob.y = canvas.height - bloob.height;
    bloob.isOnGround = true;
    bloob.vy = -bloob.gravity;
  };
};

update();

// fonction de mise à jour
function update(){
  requestAnimationFrame(update, canvas);
  switch(gameState){
    case LOADING:
      console.log("loading...");
      break;
    case PLAYING:
      playGame();
      break;
  };
  render();
};

// Fonction d'affichage
function render(){
  drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
  drawingSurface.save();
  //Affichage des sprites contenus dans le tableau sprites sous forme d'objets
  if(sprites.length !== 0){
    for(var i = 0; i < sprites.length; i++){
      var sprite = sprites[i];
      if(sprite.visible){
        drawingSurface.drawImage(image,sprite.sourceX, sprite.sourceY,sprite.sourceWidth, sprite.sourceHeight,
        Math.floor(sprite.x), Math.floor(sprite.y),sprite.width, sprite.height);
      };
    };
  };
  drawingSurface.restore();
};
