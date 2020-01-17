import React from 'react'
import ReactDOM from 'react-dom'

const Message = {

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  async build(category, text) {
    this.remove()

    const html = (
      <div className={`message message-type-${category}`}>
        <main>
          <div>
            <p dangerouslySetInnerHTML={{__html: text}} />
          </div>
        </main>
        <button className='message-button' type='button' />
      </div>
    )

    const containerMessage = document.createElement('div')
    containerMessage.id = 'container-message'

    document.getElementById('root').appendChild(containerMessage)
    ReactDOM.render(html, document.getElementById('container-message'))

    await this.sleep(5000)
    this.remove()
  },

  remove() {
    const element = document.getElementById('container-message')

    if (element !== null) { element.remove() }
  },
}

export default Message
