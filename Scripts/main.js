nova.commands.register("insert-line.before", (editor) => {    
    editor.edit((edit) => {
        const range = editor.getLineRangeForRange(editor.selectedRange)
        editor.selectedRange = new Range(range.start, range.start)
        edit.replace(editor.selectedRange, "\n")
    })
})

nova.commands.register("insert-line.after", (editor) => {
    editor.edit((edit) => {
        const range = editor.getLineRangeForRange(editor.selectedRange)
        editor.selectedRange = new Range(range.end, range.end)
        edit.replace(editor.selectedRange, "\n")
    })
})
