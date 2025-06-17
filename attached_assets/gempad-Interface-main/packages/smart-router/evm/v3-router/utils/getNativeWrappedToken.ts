import { ChainId, Token, WNATIVE } from '@dapp/sdk'

export function getNativeWrappedToken(chainId: ChainId): Token | null {
  return WNATIVE[chainId] ?? null
}
