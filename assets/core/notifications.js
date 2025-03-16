function notice(
    header = "Система", 
    description = "Оповещение", 
    style = {
        'icon': 'fa-info',
    }
) {
    const container = document.querySelector('notifications')
    const notice = document.createElement('notice')
    const span = document.createElement('span')
    const icon = document.createElement('i')
    const content = document.createElement('content')
    const caption = document.createElement('h1')
    const descript = document.createElement('p')
    const button = document.createElement('button')
    const buttonIconContainer = document.createElement('span')
    const buttonIcon = document.createElement('i')

    container.appendChild(notice)
    notice.appendChild(span)
    span.appendChild(icon)
    notice.appendChild(content)
    content.appendChild(caption)
    content.appendChild(descript)
    notice.appendChild(button)
    button.appendChild(buttonIconContainer)
    buttonIconContainer.appendChild(buttonIcon)
    span.classList.add('icon')
    if (header != '') {
        caption.innerHTML = header
        descript.innerHTML = description
        if (style != {}) {
            if ('icon' in style) {
                icon.classList.add('fa-solid', style['icon'])
            } if ('color-light' in style) {
                notice.style.backgroundColor = style['color-light']
            } if ('color-dark' in style) {
                icon.setAttribute('style', 'color:' + style['color-dark'])
                if (!buttonIconContainer.getAttribute('style')) {
                    buttonIconContainer.addEventListener('mouseover', () => {
                        buttonIconContainer.setAttribute('style', 'color:' + style['color-dark'])
                    })
                    buttonIconContainer.addEventListener('mouseout', () => {
                        buttonIconContainer.setAttribute('style', 'color: #57606f')
                    })
                }
            }
        }

        buttonIcon.classList.add('fa-solid', 'fa-xmark')
        button.addEventListener('click', () => {
            if (screen.width > 750) {
                notice.style.animationName = "noticeRemove"
            } else {
                notice.style.animationName = "noticeRemoveMobile"
            }
            notice.addEventListener('animationend', () => {
                notice.remove()
            })
        })

        //  setTimeout(() => {
        //      if (screen.width > 750) {
        //          notice.style.animationName = "noticeRemove"
        //      } else {
        //          notice.style.animationName = "noticeRemoveMobile"
        //      }
        //      notice.addEventListener('animationend', () => {
        //          notice.remove()
        //      })
        //  }, 5000)
    }
}