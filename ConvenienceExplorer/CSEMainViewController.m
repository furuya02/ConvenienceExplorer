//
//  ViewController.m
//  ConvenienceExplorer
//
//  Created by hirauchi.shinichi on 2016/07/28.
//  Copyright © 2016年 SAPPOROWORKS. All rights reserved.
//

#import "CSEMainViewController.h"
#import "AFNetworking.h"
#import "CSEConvenienceStoreRepository.h"
#import <CoreLocation/CoreLocation.h>
#import "SecretKey.h"
#import "SVProgressHUD.h"
#import <WikitudeSDK/WikitudeSDK.h>

@interface CSEMainViewController ()<WTArchitectViewDelegate, CLLocationManagerDelegate>

@property (weak, nonatomic) IBOutlet WTArchitectView *architectView;
@property (nonatomic, weak) WTNavigation *architectWorldNavigation;
@property (nonatomic) CLLocationManager *locationManager;
@property (nonatomic,strong) CSEConvenienceStoreRepository *convenienceStoreRepository;

@end

@implementation CSEMainViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    self.convenienceStoreRepository = [[CSEConvenienceStoreRepository alloc]init];

    NSError *deviceSupportError = nil;
    if ([WTArchitectView isDeviceSupportedForRequiredFeatures:WTFeature_2DTracking|WTFeature_Geo error:&deviceSupportError]) {
        self.architectView.delegate = self;

        // SecretKey.hに下記の定義がありますが、Githubには公開されておりません
        // #define WT_LICENSE_KEY @"XXXXXXXXXXX"
        [self.architectView setLicenseKey:WT_LICENSE_KEY];
        self.architectWorldNavigation = [self.architectView loadArchitectWorldFromURL:[[NSBundle mainBundle] URLForResource:@"index" withExtension:@"html" subdirectory:@"ArchitectWorld"] withRequiredFeatures:WTFeature_Geo | WTFeature_2DTracking];

        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didReceiveApplicationWillResignActiveNotification:) name:UIApplicationWillResignActiveNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didReceiveApplicationDidBecomeActiveNotification:) name:UIApplicationDidBecomeActiveNotification object:nil];

    }
    else {
        NSLog(@"WTArchitectView. Error: %@", [deviceSupportError localizedDescription]);
    }
    self.locationManager = [[CLLocationManager alloc] init];
    // iOS8以上
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {
        // アプリ起動時のみの位置情報を取得の許可を得る
        [ self.locationManager requestWhenInUseAuthorization];
    }
    self.locationManager.delegate = self;
    [SVProgressHUD setDefaultStyle:SVProgressHUDStyleDark];
    [SVProgressHUD setDefaultAnimationType:SVProgressHUDAnimationTypeNative];
}

#pragma mark - View Lifecycle

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self startWikitudeSDKRendering];
}

- (void)viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];
    [self stopWikitudeSDKRendering];
}

#pragma mark - Action

- (IBAction)tapButton:(id)sender
{
    NSString *javascript = [NSString stringWithFormat:@"clearData()"];
    [self.architectView callJavaScript:javascript];
    [SVProgressHUD show];
    [self.locationManager startUpdatingLocation]; // 位置の取得開始
}

#pragma mark - LocationManager delegate

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations
{

    // 位置の取得は１回のみ
    [self.locationManager stopUpdatingLocation];

    // 現在の位置を取得する
    CLLocation *location = [locations lastObject];

    NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];
    [nc addObserver:self selector:@selector(didSearchFinishNotification) name:@"SearchFinish" object:nil];

    // コンビニ情報リポジトリの更新
    [self.convenienceStoreRepository refreshWithLocation:location.coordinate.latitude :location.coordinate.longitude :location.altitude];
}

#pragma mark - View Rotation

- (BOOL)shouldAutorotate
{
    return YES;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskAll;
}

- (void)willRotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation duration:(NSTimeInterval)duration
{
    [self.architectView setShouldRotate:YES toInterfaceOrientation:toInterfaceOrientation];
}

#pragma mark - Notifications

- (void)didReceiveApplicationWillResignActiveNotification:(NSNotification *)notification
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [self stopWikitudeSDKRendering];
    });
}

- (void)didReceiveApplicationDidBecomeActiveNotification:(NSNotification *)notification
{
    dispatch_async(dispatch_get_main_queue(), ^{

        if ( self.architectWorldNavigation.wasInterrupted )
        {
            [self.architectView reloadArchitectWorld];
        }

        [self startWikitudeSDKRendering];
    });
}

-(void)didSearchFinishNotification
{
    NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];
    [nc removeObserver:self];

    // JavaScriptへのデータ送信
    NSString *jsonData = self.convenienceStoreRepository.jsonData;
    NSString *javascript = [NSString stringWithFormat:@"createData('%@')",jsonData];
    [SVProgressHUD dismiss];
    [self.architectView callJavaScript:javascript];
}

#pragma mark - Private Methods

- (void)startWikitudeSDKRendering
{
    if ( ![self.architectView isRunning] ) {
        [self.architectView start:^(WTStartupConfiguration *configuration) {
        } completion:^(BOOL isRunning, NSError *error) {
            if ( !isRunning ) {
                NSLog(@"WTArchitectView could not be started. Reason: %@", [error localizedDescription]);
            }
        }];
    }
}

- (void)stopWikitudeSDKRendering
{
    if ( [self.architectView isRunning] ) {
        [self.architectView stop];
    }
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end


