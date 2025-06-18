import {Router} from 'express';
import {signUp,login} from '../controller/userControllar'
import {postVibe} from '../controller/VibesControllar'
import auth from '../middleware/auth'
const router = Router()

router.route('/signUp').post(signUp)
router.route('/login').post(login)
router.route('/vibes').post(auth,postVibe)
// router.route('/vibes').get(auth,getVibe)

export default router