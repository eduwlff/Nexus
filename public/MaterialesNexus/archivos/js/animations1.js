window.addEventListener('load',(e)=>{
    let articles= document.querySelectorAll('.card1');

    let show=()=>{
    const windowHeight= window.innerHeight;

    articles.forEach(el => {
        
        let articleHeight= el.getBoundingClientRect().top;
        if(articleHeight<windowHeight){
            el.classList.add('card1--show')
        }else{
            el.classList.remove('card1--show');
        }
    });

    }
    show();

    window.addEventListener('scroll',show);
})
