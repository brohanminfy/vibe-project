import {Router} from 'express';
import {signUp,login, followUser} from '../controller/userControllar'
import {postVibe,getVibe,like, feed, deleteVibe} from '../controller/VibesControllar'
import auth from '../middleware/auth'
const router = Router()


router.get('/test',(req,res)=>{
    res.send("Hello Ping")
})


router.post('/signUp',signUp)
router.post('/login',login)
router.post('/vibes',auth,postVibe)
router.get('/vibes',getVibe)
router.put('/:id/like',auth,like)
router.post('/users/:userId/follow', auth, followUser)
router.get('/feed', auth, feed)
router.delete('/vibes/:id', auth, deleteVibe)

export default router   