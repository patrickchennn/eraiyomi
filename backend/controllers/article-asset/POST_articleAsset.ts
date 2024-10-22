import { Request,Response } from "express"
import {POST_ReqBodyArticle} from "@patorikkuuu/eraiyomi-types"

/**
 * @desc Create an article asset. By saying asset, I mean such things like images, videos, the actual content
 * @route POST /api/article-asset
 * @access private not accessable to public
 */
export const POST_articleAsset =  async (
  req: Request<{}, {}, POST_ReqBodyArticle>,
  res: Response
) => {


}
