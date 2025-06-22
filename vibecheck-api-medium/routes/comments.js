import {Router} from 'express';
import {postcomment,getcomments} from '../controller/VibesControllar'

import auth from '../middleware/auth'
const router = Router()


router.post('/:id/comment',auth,postcomment)
router.get('/:id/comment',getcomments)
export default router