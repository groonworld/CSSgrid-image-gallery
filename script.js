/********************************************************************************
 * The AutoPrune script hides excess elements from the responsive grid so that  *
 * the picture gallery always displays as full rows, regardless of screen size. *
 *                                                                              *
 * Copyright 2019 @Groonworld.                                                  *
 * Published under MIT license: https://opensource.org/licenses/MIT             *
 *******************************************************************************/

const gridAutoPrune = (function() {
    let win           = document.defaultView;   // gets the window object
    let grid          = document.getElementById('gallery-wrapper'); 
    let elementWidth  = getElementWidth();      // Minimal picture width as defined by the minmax() attribute of the CSS grid
    let elementList   = grid.children;
    let nrOfElements  = elementList.length;     // Number of elements within the grid

    
    function getElementWidth() {
    // gets the current width of the grid elements   
        let string = getComputedStyle(grid).gridTemplateColumns; // returns a string of px units
        let width  = string.match(/\d+/g).map(Number);           // Returns an array containing the numbers from the string

        return width[0]; // Since the elements are equally sized it doesn't matter which one we return
    }
    
    function getColumns() {
    // Calculates the current number of grid-columns based on the width of the viewport.    
        let currentSize = win.innerWidth;
        let columns     = Math.floor(currentSize / elementWidth); 

        return columns;
    }

    function resetVisibility() {
    // Sets display value of all elements to "block" to undo possible effects of previous screen-resizery
        for (let i = 0; i < elementList.length; i++) {
            elementList[i].style.display = "block";
        }
        console.log("All items are being displayed.");
    }

    function killTheChildren() {
    // This removes all trailing elements that would otherwise be wrapped onto a row that can't be filled entirely.
        let columns  = getColumns();  /* Possibly wrap this in a TimeOut to prevent this function from running needlessly often while the window is still being resized. */
        let fullRows = (Math.floor(nrOfElements / columns)) * columns; // Number of elements needed to fill up all rows
        resetVisibility(); // Restore visibility to all previously hidden items

        console.log("Elements needed to get full rows: " + fullRows);
        // Check that we don't accidentally remove all child nodes, or run this code needlessly on a 1-col-layout
        if (nrOfElements > fullRows 
            && fullRows !== 1) {    
            // loop over excess elements (= element index > fullRows) and set their display property to "none".
            for (let j = (fullRows); j < elementList.length; j++) {
                elementList[j].style.display = "none";
                console.log("Hiding element #" + (j+1) + ".");
            }
        }
    }
    
    // Add eventListener to ensure resizing the window won't break the script
    win.addEventListener('resize', killTheChildren);
    
    // Run the script on page load:
    killTheChildren();    
})();