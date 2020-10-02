function getSelectedLineRanges (editor) {
    return editor.selectedRanges
        // convert selection ranges to line ranges
        .map((range) => editor.getLineRangeForRange(range))
        // filter out multiple selections on a single line
        .filter((range, index, ranges) => {
            return index === 0 || !range.isEqual(ranges[index - 1])
        })
}

nova.commands.register("insert-line.before", (editor) => {
    let ranges
    editor.edit((edit) => {
        ranges = getSelectedLineRanges(editor)
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
            .map((range, index, ranges) => {
                const offset = ranges.length - 1 - index
                range = new Range (range.start + offset, range.start + offset)
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
        ranges = getSelectedLineRanges(editor)
            // work from the end of the file
            .reverse()
            // add a newline at the end of each line with a cursor
            .map((lineRange) => {
                // const lineRange = editor.getLineRangeForRange(range)
                const range = new Range(lineRange.end, lineRange.end)
                edit.replace(range, "\n")
                // special case: cursor on last line
                if (isLastLine(lineRange)) {
                    return new Range(range.end + 1, range.end + 1)
                }
                return range
            })
            // update ranges to account for newly added line breaks
            .map((range, index, ranges) => {
                const offset = ranges.length - 1 - index
                range = new Range (range.end + offset, range.end + offset)
                return range;
            })
            // put cursor ranges back in ascending order
            .reverse()
    }).then(() => {
        editor.selectedRanges = ranges
    })
})
