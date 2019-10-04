export const wait = (time = 50) => new Promise(resolve => {
    setTimeout(() => resolve(), time);
});

export const nextTick = () => wait(0);