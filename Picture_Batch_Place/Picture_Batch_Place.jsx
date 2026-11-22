
#target "InDesign"

(function () {

    if (app.documents.length === 0) {
        alert("請先開啟 InDesign 文件！");
        return;
    }

    var doc = app.activeDocument;

    // 選取多張圖片
    var files = File.openDialog(
        "選取漫畫圖片（依負數至正數排序）",
        "*.tif;*.tiff;*.jpg;*.jpeg;*.png",
        true
    );

    if (!files || files.length === 0) return;

    // 取得檔名數字
    function getNumber(file) {
        var name = file.name.replace(/\.[^.]+$/, "");

        if (!/^-?\d+$/.test(name)) {
            return null;
        }

        return parseInt(name, 10);
    }

    // 檢查檔名
    for (var i = 0; i < files.length; i++) {
        if (getNumber(files[i]) === null) {
            alert(
                "檔名格式錯誤：\n" +
                files[i].name +
                "\n\n請使用 -3.tif、-2.tif、0.tif、1.tif 格式。"
            );
            return;
        }
    }

    // 負數到正數排序
    files.sort(function (a, b) {
        return getNumber(a) - getNumber(b);
    });

    // 檢查是否有重複編號
    for (var i = 1; i < files.length; i++) {
        if (getNumber(files[i]) === getNumber(files[i - 1])) {
            alert("發現重複編號：" + files[i].name);
            return;
        }
    }

    // 自動增加頁數
    while (doc.pages.length < files.length) {
        doc.pages.add();
    }

    // 逐頁匯入圖片
    for (var i = 0; i < files.length; i++) {

        var page = doc.pages[i];
        var bounds = page.bounds;

        // 建立滿版圖片框
        var frame = page.rectangles.add();

        frame.geometricBounds = bounds;

        // 放入圖片
        frame.place(files[i]);

        // 按比例填滿並置中
        frame.fit(FitOptions.FILL_PROPORTIONALLY);
        frame.fit(FitOptions.CENTER_CONTENT);
    }

    alert(
        "圖片匯入完成！\n\n" +
        "總共匯入：" + files.length + " 張\n" +
        "排序：負數 → 0 → 正數\n" +
        "排版：每頁一張、滿版置中"
    );

})();