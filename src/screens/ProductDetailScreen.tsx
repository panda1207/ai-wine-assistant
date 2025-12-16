import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Share,
  Alert,
} from 'react-native';
import { Product } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface ProductDetailScreenProps {
  product: Product;
  recommendedProducts: Product[];
  onBack?: () => void;
  onAddToCart?: () => void;
  onOpenChat?: () => void;
  onProductSelect?: (product: Product) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  recommendedProducts,
  onBack,
  onAddToCart,
  onOpenChat,
  onProductSelect,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    tastingNotes: true,
    description: true,
  });
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: string]: boolean }>({});
  const scrollY = useRef(new Animated.Value(0)).current;
  const skeletonOpacity = useRef(new Animated.Value(0.3)).current;
  const mainScrollViewRef = useRef<ScrollView>(null);
  const imageGalleryRef = useRef<ScrollView>(null);

  React.useEffect(() => {
    // Reset all scroll positions and image index when product changes
    mainScrollViewRef.current?.scrollTo({ y: 0, animated: false });
    imageGalleryRef.current?.scrollTo({ x: 0, animated: false });
    setCurrentImageIndex(0);
    // Reset loading states for new product
    const loadingStates: { [key: string]: boolean } = {};
    product.images.forEach((_, index) => {
      loadingStates[`${product.id}-${index}`] = true;
    });
    setImageLoadingStates(loadingStates);
  }, [product.id]);

  React.useEffect(() => {
    // Skeleton pulsing animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(skeletonOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(skeletonOpacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, [skeletonOpacity]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this wine: ${product.name} from ${product.winery}! ${product.region} - $${product.price.toFixed(2)}`,
        title: product.name,
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to share at this time');
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`star-${i}`} name="star" size={16} color="#B72E61" />);
    }
    if (hasHalfStar) {
      stars.push(<Ionicons key="star-half" name="star-half" size={16} color="#B72E61" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`star-empty-${i}`} name="star-outline" size={16} color="#B72E61" />);
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.stickyHeaderTitle} numberOfLines={1}>
          {product.name}
        </Text>
        <TouchableOpacity style={styles.headerIconButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#333" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        ref={mainScrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
      >
        {/* Image Gallery */}
        <View style={styles.imageGalleryContainer}>
          <ScrollView
            ref={imageGalleryRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setCurrentImageIndex(index);
            }}
          >
            {product.images.map((image, index) => {
              const imageKey = `${product.id}-${index}`;
              const isLoading = imageLoadingStates[imageKey];
              return (
                <View key={imageKey} style={styles.imageContainer}>
                  {isLoading && (
                    <Animated.View style={[styles.imageSkeleton, { opacity: skeletonOpacity }]}>
                      <Ionicons name="image-outline" size={80} color="#ccc" />
                    </Animated.View>
                  )}
                  <Image
                    source={{ uri: image }}
                    style={styles.productImage}
                    resizeMode="cover"
                    onLoadEnd={() => {
                      setImageLoadingStates(prev => ({
                        ...prev,
                        [imageKey]: false,
                      }));
                    }}
                  />
                </View>
              );
            })}
          </ScrollView>
          
          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentImageIndex === index && styles.activeIndicator,
                ]}
              />
            ))}
          </View>

          {/* Badges Overlay */}
          {product.badges && product.badges.length > 0 && (
            <View style={styles.badgesOverlay}>
              {product.badges.map((badge, index) => (
                <View key={index} style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.contentContainer}>
          {/* Title and Winery */}
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.winery}>{product.winery}</Text>
          <Text style={styles.region}>
            <Ionicons name="location-outline" size={14} color="#666" /> {product.region}
          </Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>{renderStars(product.rating)}</View>
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviewCount} reviews)
            </Text>
          </View>

          {/* Price and Stock */}
          <View style={styles.priceStockContainer}>
            <View>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              <Text style={styles.bottleSize}>{product.bottleSize}</Text>
            </View>
            <View style={styles.stockContainer}>
              {product.inStock ? (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#4caf50" />
                  <Text style={styles.inStock}>
                    In Stock ({product.stockCount} available)
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="close-circle" size={20} color="#d32f2f" />
                  <Text style={styles.outOfStock}>Out of Stock</Text>
                </>
              )}
            </View>
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfoContainer}>
            <View style={styles.quickInfoItem}>
              <Ionicons name="wine-outline" size={20} color="#B72E61" />
              <Text style={styles.quickInfoLabel}>Type</Text>
              <Text style={styles.quickInfoValue} numberOfLines={2}>
                {product.varietal.length > 20 ? 'Bordeaux Blend' : product.varietal}
              </Text>
            </View>
            <View style={styles.quickInfoItem}>
              <Ionicons name="calendar-outline" size={20} color="#B72E61" />
              <Text style={styles.quickInfoLabel}>Vintage</Text>
              <Text style={styles.quickInfoValue}>{product.vintage}</Text>
            </View>
            <View style={styles.quickInfoItem}>
              <Ionicons name="flask-outline" size={20} color="#B72E61" />
              <Text style={styles.quickInfoLabel}>ABV</Text>
              <Text style={styles.quickInfoValue}>{product.alcoholContent}%</Text>
            </View>
          </View>

          {/* Ask Expert Button */}
          <TouchableOpacity style={styles.askExpertButton} onPress={onOpenChat}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#B72E61" />
            <Text style={styles.askExpertText}>Ask our wine expert</Text>
          </TouchableOpacity>

          {/* Description Section */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection('description')}
            >
              <Text style={styles.sectionTitle}>About This Wine</Text>
              <Ionicons
                name={expandedSections.description ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#333"
              />
            </TouchableOpacity>
            {expandedSections.description && (
              <Animated.View style={styles.sectionContent}>
                <Text style={styles.description}>{product.description}</Text>
              </Animated.View>
            )}
          </View>

          {/* Tasting Notes Section */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection('tastingNotes')}
            >
              <Text style={styles.sectionTitle}>Tasting Notes</Text>
              <Ionicons
                name={expandedSections.tastingNotes ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#333"
              />
            </TouchableOpacity>
            {expandedSections.tastingNotes && (
              <View style={styles.sectionContent}>
                {product.tastingNotes.map((category, index) => (
                  <View key={index} style={styles.tastingCategory}>
                    <Text style={styles.tastingCategoryTitle}>{category.category}</Text>
                    <View style={styles.tastingNotesGrid}>
                      {category.notes.map((note, noteIndex) => (
                        <View key={noteIndex} style={styles.tastingNoteChip}>
                          <Text style={styles.tastingNoteText}>{note}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Food Pairings */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection('pairings')}
            >
              <Text style={styles.sectionTitle}>Perfect Pairings</Text>
              <Ionicons
                name={expandedSections.pairings ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#333"
              />
            </TouchableOpacity>
            {expandedSections.pairings && (
              <View style={styles.sectionContent}>
                <View style={styles.pairingsContainer}>
                  {product.pairings.map((pairing, index) => (
                    <View key={index} style={styles.pairingChip}>
                      <Ionicons name="restaurant-outline" size={16} color="#B72E61" />
                      <Text style={styles.pairingText}>{pairing}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Expert Review */}
          {product.expertReview && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection('expertReview')}
              >
                <Text style={styles.sectionTitle}>Expert Review</Text>
                <Ionicons
                  name={expandedSections.expertReview ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>
              {expandedSections.expertReview && (
                <View style={styles.sectionContent}>
                  <View style={styles.expertReviewContainer}>
                    <Ionicons name="ribbon-outline" size={24} color="#B72E61" />
                    <Text style={styles.expertReviewText}>{product.expertReview}</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Provenance */}
          {product.provenance && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection('provenance')}
              >
                <Text style={styles.sectionTitle}>Provenance</Text>
                <Ionicons
                  name={expandedSections.provenance ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>
              {expandedSections.provenance && (
                <View style={styles.sectionContent}>
                  <View style={styles.provenanceContainer}>
                    <Ionicons name="shield-checkmark-outline" size={24} color="#4caf50" />
                    <Text style={styles.provenanceText}>{product.provenance}</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Recommendations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>You May Also Like</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendationsScroll}>
              {recommendedProducts.map((recProduct) => (
                <TouchableOpacity
                  key={recProduct.id}
                  style={styles.recommendationCard}
                  onPress={() => onProductSelect?.(recProduct)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: recProduct.images[0] }} style={styles.recommendationImage} />
                  <Text style={styles.recommendationName} numberOfLines={2}>
                    {recProduct.name}
                  </Text>
                  <View style={styles.recommendationRating}>
                    {renderStars(recProduct.rating).slice(0, 5)}
                  </View>
                  <Text style={styles.recommendationPrice}>${recProduct.price.toFixed(2)}</Text>
                  {recProduct.badges && recProduct.badges[0] && (
                    <View style={styles.recommendationBadge}>
                      <Text style={styles.recommendationBadgeText}>{recProduct.badges[0]}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={styles.stickyBottomContainer}>
        <TouchableOpacity
          style={[styles.addToCartButton, !product.inStock && styles.disabledButton]}
          onPress={onAddToCart}
          disabled={!product.inStock}
        >
          <Ionicons name="cart-outline" size={24} color="#fff" />
          <Text style={styles.addToCartText}>
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  stickyHeaderTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  headerIconButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  imageGalleryContainer: {
    height: 400,
    position: 'relative',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: 400,
    position: 'relative',
  },
  imageSkeleton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
    width: 24,
  },
  badgesOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  badge: {
    backgroundColor: '#B72E61',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  productName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  winery: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
  },
  region: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  priceStockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#B72E61',
  },
  bottleSize: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  inStock: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '600',
    marginLeft: 6,
    flexShrink: 1,
  },
  outOfStock: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '600',
    marginLeft: 6,
  },
  quickInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  quickInfoItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  quickInfoLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 6,
    textAlign: 'center',
  },
  quickInfoValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
    textAlign: 'center',
  },
  askExpertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#B72E61',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 24,
  },
  askExpertText: {
    color: '#B72E61',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  sectionContent: {
    overflow: 'hidden',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#666',
  },
  tastingCategory: {
    marginBottom: 16,
  },
  tastingCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tastingNotesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tastingNoteChip: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  tastingNoteText: {
    fontSize: 14,
    color: '#666',
  },
  pairingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pairingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#B72E61',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  pairingText: {
    fontSize: 14,
    color: '#B72E61',
    marginLeft: 6,
  },
  expertReviewContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#B72E61',
  },
  expertReviewText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#666',
    marginLeft: 12,
    fontStyle: 'italic',
  },
  provenanceContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f8f4',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  provenanceText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginLeft: 12,
  },
  recommendationsScroll: {
    marginTop: 16,
  },
  recommendationCard: {
    width: 150,
    marginRight: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
  },
  recommendationImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    height: 36,
  },
  recommendationRating: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  recommendationPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B72E61',
  },
  recommendationBadge: {
    backgroundColor: '#B72E61',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  recommendationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  bottomSpacing: {
    height: 120,
  },
  stickyBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  addToCartButton: {
    backgroundColor: '#B72E61',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
});
