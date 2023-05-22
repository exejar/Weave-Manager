const fadeWindowOut =  (_window, step = 0.1, fadeEveryXSeconds = 10, closeWindow = false) =>  {
    let opacity = _window.getOpacity()
    const interval = setInterval(() => {
        if (opacity <= 0) {
            clearInterval(interval)
            if (closeWindow)
                _window.close()
            else
                _window.minimize()
        }
        _window.setOpacity(opacity)
        opacity -= step
    }, fadeEveryXSeconds)
    return interval
}

const fadeWindowIn = (_window, step = 0.1, fadeEveryXSeconds = 10)  => {
    let opacity = _window.getOpacity()
    const interval = setInterval(() => {
        if (opacity >= 1) clearInterval(interval)
        _window.setOpacity(opacity)
        opacity += step
    }, fadeEveryXSeconds)
    return interval
}

module.exports = {
    fadeWindowOut, fadeWindowIn
}