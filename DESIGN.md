# Design Architecture

This document outlines the design architecture of the project, detailing the key components and their interactions.

## Visual Console (WebviewView)

The Visual Console acts as the display panel for viewing program output and providing interactive input. Its content is determined by the selection in the Outputs view.

### Output Section

- Displays the program output for the selected run.
- Output is syntax-highlighted for readability.
- Status messages (e.g., success, warning, error) use colors from the user's active VS Code theme for native integration.

### Input Section

- A text field at the bottom allows for interactive input when a run is not associated with a pre-defined input set.
- Placeholder text guides the user, indicating the current state (e.g., "Type here to input", "Executing...").

## Inputs (TreeView)

This view is the central hub for creating and managing reusable inputs.

- It displays a list of files, with each file node containing one or more saved inputs.
- An "Add" button allows the user to save the currently open file and/or create a new input for it.
- A "Focus" button expands the file node corresponding to the active editor tab.
- Users can drag and drop nodes to reorder them.

## Run Queue (TreeView)

This view lists the selected runs to be executed in order.

- A button on an input node sends that specific input to the queue.
- A button on a file node can queue an "interactive" run, where the user will type input live in the Visual Console.
- Another button on a file node can send all saved inputs for that file to the queue.

## Outputs (TreeView)

This view functions as a navigation panel and session history for all program runs.

- Each executed run adds a new output node to this tree.
- The node is named to identify the run (e.g., based on the input name and a timestamp).
- Clicking an output node populates the Visual Console with the corresponding output from that specific run, allowing the user to review past results.
