//
//  CSEConvenienceStore.h
//  ConvenienceExplorer
//
//  Created by hirauchi.shinichi on 2016/07/28.
//  Copyright © 2016年 SAPPOROWORKS. All rights reserved.
//

#import <UIKit/UIKit.h>

/**
 コンビニの種類
 */
typedef NS_ENUM(NSInteger, Grouping)
{
    GroupingUnknown = 0,
    GroupingFamilymart = 1,
    GroupingLowson = 2,
    GroupingSeicomart = 3,
    GroupingSeveneleven = 4,
    GroupingSanks = 5
};

/**
 コンビニの店舗情報を格納するクラス
 */
@interface CSEConvenienceStore : NSObject

@property (strong, nonatomic) NSString *name;
@property (strong, nonatomic) NSString *vicinity;
@property (nonatomic) float latitude;
@property (nonatomic) float longitude;
@property (nonatomic) float altitude;
@property (nonatomic) float distance;
@property (nonatomic) NSString  *distanceStr;
@property (nonatomic) Grouping grouping;

- (id)initWithJson:(NSDictionary *)json;

@end

