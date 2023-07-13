interface UpdatingObject {
    tick? : {(delta : number): void},
    onResize? : {(): void}
}

export { UpdatingObject };