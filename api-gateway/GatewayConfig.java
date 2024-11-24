import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("order-service", r -> r.path("/order/**")
                        .filters(f -> f.rewritePath("/order/(?<segment>.*)", "/api/${segment}")) // Rewrites /order/** to /api/** for the order service
                        .uri("lb://order-service")) // Uses service discovery via Eureka
                .route("inventory-service", r -> r.path("/inventory/**")
                        .uri("lb://inventory-service"))
                .route("user-service", r -> r.path("/users/**")
                        .uri("lb://user-service"))
                .build();
    }
}