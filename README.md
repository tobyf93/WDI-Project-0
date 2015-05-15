# WDI-Project-0
## Installation Instructions:
Click the link.

## Implemented Features:
+ Player vs Player
+ Game Over Animations and Restart
+ Player vs AI
+ AI solution tree compiled[1]
+ Player vs AI (difficulty: 'get fucked') [1]

[1] Not enabled

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
  + Getting full tree lookup working
  + Limit tree lookup depth to be used as a difficulty level
+ CSS styling which wasn't given any attention until day of presentation...
+ Clean up code (there were a few hacks introduced in the later stages)
