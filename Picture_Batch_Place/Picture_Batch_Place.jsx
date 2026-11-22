
#target "InDesign"

(function () {

    if (app.documents.length === 0) {
        alert("Please open an InDesign document first!");
        return;
    }

    var doc = app.activeDocument;

    // Select multiple images
    var files = File.openDialog(
        "Select comic images (sorted from negative to positive)",
        "*.tif;*.tiff;*.jpg;*.jpeg;*.png",
        true
    );

    if (!files || files.length === 0) return;

    // Extract numeric value from filename
    function getNumber(file) {
        var name = file.name.replace(/\.[^.]+$/, "");

        if (!/^-?\d+$/.test(name)) {
            return null;
        }

        return parseInt(name, 10);
    }

    // Validate filenames
    for (var i = 0; i < files.length; i++) {
        if (getNumber(files[i]) === null) {
            alert(
                "Invalid filename format:\n" +
                files[i].name +
                "\n\nPlease use numeric filenames such as -3.tif, -2.tif, 0.tif, or 1.tif."
            );
            return;
        }
    }

    // Sort files from negative to positive
    files.sort(function (a, b) {
        return getNumber(a) - getNumber(b);
    });

    // Check for duplicate numbers
    for (var i = 1; i < files.length; i++) {
        if (getNumber(files[i]) === getNumber(files[i - 1])) {
            alert("Duplicate filename number detected: " + files[i].name);
            return;
        }
    }

    // Automatically add pages if needed
    while (doc.pages.length < files.length) {
        doc.pages.add();
    }

    // Place images on pages
    for (var i = 0; i < files.length; i++) {

        var page = doc.pages[i];
        var bounds = page.bounds;

        // Create a full-page image frame
        var frame = page.rectangles.add();

        frame.geometricBounds = bounds;

        // Place image
        frame.place(files[i]);

        // Fill frame proportionally and center image
        frame.fit(FitOptions.FILL_PROPORTIONALLY);
        frame.fit(FitOptions.CENTER_CONTENT);
    }

    alert(
        "Image import completed!\n\n" +
        "Total images placed: " + files.length + "\n" +
        "Sorting: Negative → Zero → Positive\n" +
        "Layout: One image per page, full-page placement"
    );

})();
