async function navigate(to, callback){
    await window.load_section("main-section", to)
    try {
        callback()
    } catch {

    }  
}
