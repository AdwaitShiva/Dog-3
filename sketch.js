//Create variables here
var dog, dogHappy, foodS, foodStock, database;
var fedTime, lastFed, feed, addFood;
var foodObj;
var gameState=0;
var readState;
var ChangeState;
var bed, garden, washroom;
var sleeping,bathing;
var LastFed=0;
function preload()
{
  rdog= loadImage("dogg.png")
  doggo= loadImage("doggo.png")
  bed=loadImage("Bed Room.png")
  garden=loadImage("Garden.png")
  washroom= loadImage("Wash Room.png")
  
	//load images here
}

function setup() {
  
	createCanvas(1000, 500);
  dog= createSprite(250,380,20,20)
  dog.addImage(rdog)
foodObj= new Food()
  dog.scale=0.3
 database= firebase.database()
  foodStock=database.ref('Food')
  foodStock.on("value",readStock)

 

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);
  
  foody=database.ref('LastFed');
  foody.on("value",function(data){
    LastFed=data.val()
  })

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })
  
}


function draw() {  
background(46,139,87)
textSize(22)
fill("red")
text("Milk Bottles: "+ foodS, 150,40);
textSize(15)
fill("white")

  drawSprites();
  foodObj.display();
  if (LastFed >= 12) {
    text("Last Feed: " + LastFed %12 + "PM", 350, 30);
  }
  else if(LastFed == 0) {
    text("Last Feed: 12AM ", 350, 30);
  }
  else {
    text("Last Feed:  " + LastFed + "AM", 350, 30);
  }
  //add styles here
if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  //dog.remove();

}else {
  feed.show()
  addFood.show()
  dog.addImage(rdog)
}


currentTime=hour();
if(currentTime==(LastFed+1)){
  update("Playing");
  foodObj.garden()
  foodObj.scale=0.5
}else if(currentTime==(LastFed+2)){
  update("Sleeping")
  foodObj.bedroom()
  foodObj.scale=1
}else if(currentTime>(LastFed+2)&& currentTime<=(LastFed+4)){
  update("Bathing")
  foodObj.washroom()
  foodObj.scale=1
}else{
  update("Hungry")
  foodObj.display()
}
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

//function to update food stock and last fed time
  function feedDog() {
    dog.addImage(doggo);

    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
      Food: foodObj.getFoodStock(),
      FeedTime : hour(),
      LastFed  : hour()
    }) 
    
  }


//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState: state
  });
}