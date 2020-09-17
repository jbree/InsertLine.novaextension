nova.commands.register("insert-line.before", (editor) => {
    let ranges
    editor.edit((edit) => {
        let offset = editor.selectedRanges.length - 1
        ranges = editor.selectedRanges
            // work from the end of the file
            .reverse()
            // add a line break to the beginning of selected line
            .map((range) => {
                range = editor.getLineRangeForRange(range)
                range = new Range(range.start, range.start)
                edit.replace(range, "\n")
                return range
            })
            // update ranges to account for newly added line breaks
            .map((range) => {
                range = new Range (range.start + offset, range.start + offset)
                offset--
                return range;
            })
            // put cursor ranges back in ascending order
            .reverse()
    }).then(() => {
        editor.selectedRanges = ranges
    })
})

nova.commands.register("insert-line.after", (editor) => {
    let ranges
    editor.edit((edit) => {
        let offset = editor.selectedRanges.length - 1
        ranges = editor.selectedRanges
            // work from the end of the file
            .reverse()
            // add a line break to the end of selected line
            .map((range) => {
                range = editor.getLineRangeForRange(range)
                range = new Range(range.end, range.end)
                edit.replace(range, "\n")
                return range
            })
            // update ranges to account for newly added line breaks
            .map((range) => {
                range = new Range (range.end + offset, range.end + offset)
                offset--
                return range;
            })
            // put cursor ranges back in ascending order
            .reverse()
    }).then(() => {
        editor.selectedRanges = ranges
    })
})
