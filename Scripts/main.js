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

    function isLastLine (range) {
        if (range.end !== editor.document.length) {
            return false
        }
        // empty last line
        if (range.start === range.end) {
            return true
        }
        // non-empty last line
        const eol = new Range(range.end - 1, range.end)
        if (editor.getTextInRange(eol) !== "\n") {
            return true
        }
        // second to last line, but last line is empty (document ends w/newline)
        return false
    }

    let ranges
    editor.edit((edit) => {
        let offset = editor.selectedRanges.length - 1
        ranges = editor.selectedRanges
            // work from the end of the file
            .reverse()
            .map((range) => {
                const lineRange = editor.getLineRangeForRange(range)
                range = new Range(lineRange.end, lineRange.end)
                edit.replace(range, "\n")
                // special case: cursor on last line
                if (isLastLine(lineRange)) {
                    return new Range(range.end + 1, range.end + 1)
                }
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
