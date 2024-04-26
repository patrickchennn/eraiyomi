26 april 2024
- try to explicitly inform the programming lang type on that <code> block
shouldn't use `hljs.highlightAuto` because sometimes is not detecting the correct language.

currently the only logic that uses `hljs.highlightAuto` is the quilljs.

