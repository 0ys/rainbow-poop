import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { open: true },
  /*
   * GitHub Pages 는 https://유저명.github.io/레포이름/ 처럼 하위 경로로 서비스된다.
   * 그래서 배포 시에는 base 를 레포 이름으로 맞춰야 CSS/JS 를 찾을 수 있다.
   * 값은 .github/workflows/deploy.yml 이 레포 이름에서 자동으로 넣어준다.
   */
  base: process.env.BASE_PATH || '/',
})
