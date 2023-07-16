function setUpPerspectiveAnimation(container : HTMLElement) {
    container.addEventListener("mousemove", (event) => {
        const screenRatio = container.clientHeight / container.clientWidth;
        const x = (event.clientX - (container.clientWidth/2)) * screenRatio;
        const y = event.clientY - (container.clientHeight/2);

        const style = "rotateX(" + x/50 + "deg) rotateY(" + y/50 + "deg)";

        for (const canvas of container.getElementsByClassName("canvas")) {
            canvas.setAttribute("transform", style);
        }
        container.style.transform = style;
    });
}

export { setUpPerspectiveAnimation };