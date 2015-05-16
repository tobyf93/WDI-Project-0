## Implemented Features:
+ Player vs Player
+ Game Over Animations and Restart
+ AI solution tree
+ Player vs AI (unbeatable)
+ Board modelled in javascript using a 2D array

## Code Structure:
+ App Object
  + Main object
  + Responsible for almost all game functions and test cases
  + Implements game state checking with optimization
+ AI Object
  + Used in conjunction with App Object when AI is enabled
  + Separated from main object to reduce coupling
  + Responsible for:
    + Calculating available moves
    + Creating solution tree with each node representing a theoretical game situation
    + Analysing solution tree - bubbling results up to the root node

## Hurdles
+ Stack overflows (as a result of jQuery calls during recursion)
+ Delays in HTML rendering

## What's next
+ AI
  + Limit tree lookup depth to be used as a difficulty level
+ CSS styling
+ Animations
+ Clean up code (there were a few hacks introduced in the later stages)
+ Responsive design