# Game of Life Simulator
Console version only Game of Life working.
Canvas grid semi-functional.

Done'd:
- reduce blurriness of lines of the canvas (suspected culprit is that the canvas dimensions are being scaled to fit something)
- make cells line up with with canvas better.
- connect renderer to the game.
- Rewrite GoL to produce a set of changes to make instead of returning a set of live cells.
- Fix GoL Algo (Fix: deleting cells that have no neighbors and therefore not caught by the cells that are scanning around it)
- Make it so that the game can automatically run.
- Add buttons for pause and start
- (Less) Improve GoL algo so that it discards points that are too far away from the board (finite pruning of cells);
- (Less) Presets for some special starting cell arangments

WIP:
- Stylize game (Just write some basic CSS)
- Add clicking the canvas can add cells to the canvas.
- Connect presets to a drop down list.