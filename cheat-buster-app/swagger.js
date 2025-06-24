import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import YAML from "yamljs"

const swaggerSpec =YAML.load("./openapi.yaml")

export { swaggerUi, swaggerSpec };