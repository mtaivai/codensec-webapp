
export const delayedPromise = (func, delay = 1000) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(func());
            } catch (e) {
                reject(e);
            }
        }, delay);
    });
};
