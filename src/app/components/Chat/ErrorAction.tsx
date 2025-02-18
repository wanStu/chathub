import { Link } from '@tanstack/react-router'
import { FC, useCallback, useContext, useState } from 'react'
import { chatGPTClient } from '~app/bots/chatgpt-webapp/client'
import { ConversationContext } from '~app/context'
import { ChatError, ErrorCode } from '~utils/errors'
import Button from '../Button'
import MessageBubble from './MessageBubble'
import { useTranslation } from 'react-i18next'

const ChatGPTAuthErrorAction = () => {
  const [fixing, setFixing] = useState(false)
  const [fixed, setFixed] = useState(false)

  const fixChatGPT = useCallback(async () => {
    setFixing(true)
    try {
      await chatGPTClient.fixAuthState()
    } catch (e) {
      console.error(e)
      return
    } finally {
      setFixing(false)
    }
    setFixed(true)
  }, [])

  if (fixed) {
    return <MessageBubble color="flat">Fixed, please retry chat</MessageBubble>
  }
  return (
    <div className="flex flex-row gap-2 items-center">
      <Button color="primary" text="Login & verify" onClick={fixChatGPT} isLoading={fixing} size="small" />
      <span className="text-sm text-primary-text">OR</span>
      <Link to="/setting">
        <Button color="primary" text="Set api key" size="small" />
      </Link>
    </div>
  )
}

const ErrorAction: FC<{ error: ChatError }> = ({ error }) => {
  const conversation = useContext(ConversationContext)
  const { t } = useTranslation()

  if (error.code === ErrorCode.BING_UNAUTHORIZED) {
    return (
      <a href="https://bing.com" target="_blank" rel="noreferrer">
        <Button color="primary" text={t('Login at bing.com')} size="small" />
      </a>
    )
  }
  if (error.code === ErrorCode.BING_FORBIDDEN) {
    return (
      <a href="https://bing.com/new" target="_blank" rel="noreferrer">
        <Button color="primary" text="Join new Bing waitlist" size="small" />
      </a>
    )
  }
  if (error.code === ErrorCode.POE_UNAUTHORIZED) {
    return (
      <a href="https://poe.com" target="_blank" rel="noreferrer">
        <Button color="primary" text={t('Login at poe.com')} size="small" />
      </a>
    )
  }
  if (error.code === ErrorCode.XUNFEI_UNAUTHORIZED) {
    return (
      <a href="https://xinghuo.xfyun.cn" target="_blank" rel="noreferrer">
        <Button color="primary" text={t('Login at xfyun.cn')} size="small" />
      </a>
    )
  }
  if (error.code === ErrorCode.GPT4_MODEL_WAITLIST) {
    return (
      <a href="https://openai.com/waitlist/gpt-4-api" target="_blank" rel="noreferrer">
        <Button color="primary" text={t('Join the waitlist')} size="small" />
      </a>
    )
  }
  if (error.code === ErrorCode.CHATGPT_CLOUDFLARE || error.code === ErrorCode.CHATGPT_UNAUTHORIZED) {
    return <ChatGPTAuthErrorAction />
  }
  if (error.code === ErrorCode.CONVERSATION_LIMIT) {
    return <Button color="primary" text="Restart" size="small" onClick={() => conversation?.reset()} />
  }
  if (error.code === ErrorCode.BARD_EMPTY_RESPONSE) {
    return (
      <a href="https://bard.google.com" target="_blank" rel="noreferrer">
        <Button color="primary" text="Visit bard.google.com" size="small" />
      </a>
    )
  }
  return null
}

export default ErrorAction
